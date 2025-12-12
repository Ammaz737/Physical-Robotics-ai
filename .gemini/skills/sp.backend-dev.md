---
name: "backend-dev"
description: "Build robust FastAPI endpoints and database integrations. Use for RAG logic, User Auth flows, and Vector DB connections."
version: "1.0.0"
---

# Backend Developer Skill

## When to Use This Skill
- Setting up FastAPI routes.
- Connecting to Neon Postgres or Qdrant.
- Implementing OpenAI Agent SDK logic.

## Process
1.  **Schema Definition**: Define Pydantic models for Request/Response.
    -   **Tool Usage**: Utilize `write_file` for new model files or `replace` for modifications.
2.  **Logic Implementation**: Write the route handler (async/await).
    -   **Tool Usage**: Utilize `write_file` for new route files or `replace` for modifications.
    -   **Ambiguity Clarification**: If API design or logic is unclear, present options and ask the user for clarification.
3.  **Database Interaction**: Secure queries (SQLAlchemy/SQLModel).
    -   **Tool Usage**: Utilize `write_file` for new database interaction files or `replace` for modifications. Use `run_shell_command` for database migrations (e.g., `alembic upgrade head`).
4.  **Security Check**: Validate inputs, check Auth tokens.
    -   **Implementation**: Incorporate FastAPI dependencies for validation and authentication.
    -   **Verification**: Suggest generating tests that cover edge cases for input validation and unauthorized access attempts.

## Output Format
-   **File Structure**: A tree-like text representation of any new or modified directories and files (e.g., using `tree /F`).
-   **Code**: Full Python code content with type hints for new or modified files.
-   **Environment Variables**: A markdown code block showing required `.env` keys with example values.


## Quality Criteria
- 100% Async implementation.
- Error handling with proper HTTP status codes.
- Modular code (Service layer pattern).

## Example Usage

**User Prompt:** "Create a FastAPI endpoint `/users/{user_id}` to retrieve user details from a PostgreSQL database. Assume a `User` Pydantic model and an existing SQLAlchemy setup. Ensure error handling for user not found."

**Agent Action (internal):**
1. Schema Definition: `User` Pydantic model (assuming it's already defined or I'd create it).
2. Logic Implementation: Write an async FastAPI route to fetch user by ID.
3. Database Interaction: Use SQLAlchemy to query the database.
4. Security Check: (Minimal for this example, but would consider auth if context provided).

**Expected Output (conceptual, truncated for brevity):**

```
Explanation:
Created a FastAPI GET endpoint `/users/{user_id}` that fetches a user from the database. It uses an async function for non-blocking I/O and handles the case where a user is not found by returning a 404 HTTP status code.

File Structure:
app/
└── routers/
    └── users.py

Code:
```python
# app/routers/users.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional

from app.database import get_session
from app.models import User, UserRead # Assuming UserRead is a Pydantic model for response

router = APIRouter()

@router.get("/users/{user_id}", response_model=UserRead)
async def read_user(user_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(User).filter(User.id == user_id)
    )
    user = result.scalars().first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

```
Environment Variables:
DATABASE_URL=postgresql+asyncpg://user:password@host:port/dbname
```