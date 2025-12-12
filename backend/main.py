import os
from datetime import timedelta
from typing import Optional, List, Union, Any
from dotenv import load_dotenv, find_dotenv

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base, Session

from pydantic import BaseModel

import cohere
from qdrant_client import QdrantClient, models

# --- NEW: Import OpenAI Client for Gemini ---
from openai import OpenAI

# Security functions (already inside backend/security.py)
from security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_access_token
)

# ----------------------------------------------------
# 1. LOAD .ENV & KEYS
# ----------------------------------------------------
load_dotenv(find_dotenv())

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") # Make sure this is in your .env
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")

# Basic check
if not all([COHERE_API_KEY, QDRANT_URL, QDRANT_API_KEY, GEMINI_API_KEY]):
    print("⚠ WARNING: Missing API Keys. Chat functionality will fail.")

# ----------------------------------------------------
# 2. INITIALIZE CLIENTS
# ----------------------------------------------------

# A. Cohere (Only for Embeddings/Search)
co = cohere.Client(COHERE_API_KEY)

# B. Qdrant (Database)
qdrant_client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

# C. OpenAI Client (Connected to Google Gemini)
llm_client = OpenAI(
    api_key=GEMINI_API_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

COLLECTION_NAME = "textbook_knowledge"
EMBEDDING_MODEL = "embed-english-v3.0" 

# ----------------------------------------------------
# 3. DATABASE SETUP
# ----------------------------------------------------
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

if not SECRET_KEY:
    SECRET_KEY = "fallback-secret-key"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# ----------------------------------------------------
# 4. DB MODELS & SCHEMAS
# ----------------------------------------------------
class DBUser(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    coding_background = Column(String)
    hardware_type = Column(String)

Base.metadata.create_all(bind=engine)

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str
    coding_background: Optional[str] = None
    hardware_type: Optional[str] = None

class User(UserBase):
    id: int
    coding_background: Optional[str] = None
    hardware_type: Optional[str] = None
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str

# ----------------------------------------------------
# 5. FASTAPI APP
# ----------------------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# 6. AUTH DEPENDENCIES
# ----------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user_by_email(db: Session, email: str):
    return db.query(DBUser).filter(DBUser.email == email).first()

def create_db_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = DBUser(
        email=user.email,
        hashed_password=hashed_password,
        coding_background=user.coding_background,
        hardware_type=user.hardware_type,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

async def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ----------------------------------------------------
# 7. ROUTES
# ----------------------------------------------------
@app.get("/")
async def root():
    return {"message": "FastAPI backend is running!"}

@app.post("/signup", response_model=User)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_db_user(db=db, user=user_data)

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=expire_minutes)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: DBUser = Depends(get_current_user)):
    return current_user

# ----------------------------------------------------
# 8. CHAT API (USING GEMINI VIA OPENAI SDK)
# ----------------------------------------------------
@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_book(
    chat_request: ChatRequest,
    current_user: DBUser = Depends(get_current_user)
):
    query = chat_request.query

    # --- Step A: Embed Query (Using Cohere) ---
    try:
        query_embedding_response = co.embed(
            texts=[query],
            model=EMBEDDING_MODEL,
            input_type="search_query"
        )
        query_embedding = query_embedding_response.embeddings[0]
    except Exception as e:
        print(f"Embedding Error: {e}")
        return ChatResponse(response="I'm having trouble searching the book (Embedding Error).")

    # --- Step B: Search Qdrant ---
    try:
        raw_search_result = qdrant_client.query_points(
            collection_name=COLLECTION_NAME,
            query=query_embedding,
            limit=5
        )
    except Exception as e:
        print(f"Qdrant Error: {e}")
        return ChatResponse(response="I'm having trouble accessing my memory database.")

    # --- Step C: Parse Results (Robustly) ---
    search_result = []
    if hasattr(raw_search_result, 'points'):
        search_result = raw_search_result.points
    elif isinstance(raw_search_result, list):
        search_result = raw_search_result

    # --- Step D: Prepare Context for Gemini ---
    context_str = ""
    if search_result:
        pieces = []
        for hit in search_result:
            # Safe payload extraction
            payload = None
            if hasattr(hit, 'payload'):
                payload = hit.payload
            elif isinstance(hit, dict):
                payload = hit.get('payload')
            
            if payload and isinstance(payload, dict) and "text" in payload:
                pieces.append(f"--- Section: {payload.get('section', 'Unknown')} ---\n{payload['text']}")
        
        context_str = "\n\n".join(pieces)

    # --- Step E: System Prompt ---
    if not context_str:
        system_prompt = (
            "You are a helpful AI assistant. "
            "The user asked a question, but I could not find relevant info in the textbook. "
            "Answer to the best of your general knowledge."
        )
    else:
        system_prompt = (
            "You are a helpful AI teaching assistant based on a specific textbook. "
            "Use the following CONTEXT to answer the user's question. "
            "If the answer is not in the context, explicitly say you cannot answer from the provided text.\n\n"
            f"CONTEXT:\n{context_str}"
        )

    # --- Step F: Call Gemini (via OpenAI SDK) ---
    try:
        completion = llm_client.chat.completions.create(
            model="gemini-2.5-flash-lite", 
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            temperature=0.3
        )
        answer = completion.choices[0].message.content

    except Exception as e:
        print(f"Gemini API Error: {e}")
        answer = f"I encountered an error connecting to the AI model: {str(e)}"

    return ChatResponse(response=answer)