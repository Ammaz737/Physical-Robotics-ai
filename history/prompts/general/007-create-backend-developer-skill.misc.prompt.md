---
id: 007
title: Create Backend Developer Skill
stage: misc
date: 2025-12-10
surface: agent
model: gemini-1.5-flash
feature: none
branch: unknown
user: unknown
command: create next skills                ---
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
2.  **Logic Implementation**: Write the route handler (async/await).
3.  **Database Interaction**: Secure queries (SQLAlchemy/SQLModel).
4.  **Security Check**: Validate inputs, check Auth tokens.

## Output Format
- **File Structure**: `app/routers/` or `app/services/`.
- **Code**: Python code with type hints.
- **Environment Variables**: List of required `.env` keys.

## Quality Criteria
- 100% Async implementation.
- Error handling with proper HTTP status codes.
- Modular code (Service layer pattern).
labels: ["skill-creation", "backend-dev"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
- .gemini/skills/sp.backend-dev.md
tests:

---

## Prompt

create next skills                ---
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
2.  **Logic Implementation**: Write the route handler (async/await).
3.  **Database Interaction**: Secure queries (SQLAlchemy/SQLModel).
4.  **Security Check**: Validate inputs, check Auth tokens.

## Output Format
- **File Structure**: `app/routers/` or `app/services/`.
- **Code**: Python code with type hints.
- **Environment Variables**: List of required `.env` keys.

## Quality Criteria
- 100% Async implementation.
- Error handling with proper HTTP status codes.
- Modular code (Service layer pattern).

## Response snapshot

Successfully created and wrote to new file: C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\.gemini\skills\sp.backend-dev.md.

## Outcome

- ✅ Impact: Skill definition for Backend Developer created.
- 🧪 Tests: No specific tests for skill creation.
- 📁 Files: 1 file created.
- 🔁 Next prompts: N/A
- 🧠 Reflection: Created new skill definition for backend development with FastAPI.

## Evaluation notes (flywheel)

- Failure modes observed: N/A
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
