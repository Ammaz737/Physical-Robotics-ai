---
id: 001
title: Generate Tasks for AI Robotics Learning Environment
stage: tasks
date: 2025-12-10
surface: agent
model: gemini-1.5-flash
feature: ai-robotics-learning-environment
branch: main
user: user
command: generate tasks.md
labels: ["tasks", "ai-robotics-learning"]
links:
  spec: specs/001-ai-robotics-learning/spec.md
  plan: specs/001-ai-robotics-learning/plan.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-ai-robotics-learning/tasks.md
tests: []
---

## Prompt

description: Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. **Setup**: Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load design documents**: Read from FEATURE_DIR:
   - **Required**: plan.md (tech stack, libraries, structure), spec.md (user stories with priorities)
   - **Optional**: data-model.md (entities), contracts/ (API endpoints), research.md (decisions), quickstart.md (test scenarios)
   - Note: Not all projects have all documents. Generate tasks based on what's available.

3. **Execute task generation workflow**:
   - Load plan.md and extract tech stack, libraries, project structure
   - Load spec.md and extract user stories with their priorities (P1, P2, P3, etc.)
   - If data-model.md exists: Extract entities and map to user stories
   - If contracts/ exists: Map endpoints to user stories
   - If research.md exists: Extract decisions for setup tasks
   - Generate tasks organized by user story (see Task Generation Rules below)
   - Generate dependency graph showing user story completion order
   - Create parallel execution examples per user story
   - Validate task completeness (each user story has all needed tasks, independently testable)

4. **Generate tasks.md**: Use `.specify.specify/templates/tasks-template.md` as structure, fill with:
   - Correct feature name from plan.md
   - Phase 1: Setup tasks (project initialization)
   - Phase 2: Foundational tasks (blocking prerequisites for all user stories)
   - Phase 3+: One phase per user story (in priority order from spec.md)
   - Each phase includes: story goal, independent test criteria, tests (if requested), implementation tasks
   - Final Phase: Polish & cross-cutting concerns
   - All tasks must follow the strict checklist format (see Task Generation Rules below)
   - Clear file paths for each task
   - Dependencies section showing story completion order
   - Parallel execution examples per user story
   - Implementation strategy section (MVP first, incremental delivery)

5. **Report**: Output path to generated tasks.md and summary:
   - Total task count
   - Task count per user story
   - Parallel opportunities identified
   - Independent test criteria for each story
   - Suggested MVP scope (typically just User Story 1)
   - Format validation: Confirm ALL tasks follow the checklist format (checkbox, ID, labels, file paths)

Context for task generation: Project: Physical AI & Humanoid Robotics Textbook Platform Status: To Do Phase 1: Infrastructure & "Skeleton" (Days 1-2) -------------------------------------------------------------------------------
[ ] **Project Init**: Initialize Docusaurus v3 project (TypeScript variant).
   - `npx create-docusaurus@latest physical-ai-book classic --typescript`
   - Clean up default blog/docs. [ ] **Repo Setup**: Initialize Git, create `.gitignore`, and push to GitHub. [ ] **Deployment Pipeline**: Configure GitHub Actions workflow for auto-deployment to GitHub Pages. [ ] **Theme Customization**: - Implement "Cyberpunk/Robotics" dark theme (custom CSS).
   - Add project logo and favicon. [ ] **Spec-Kit Integration**: Install `spec-kit-plus` and verify `.claude/skills` are accessible. Phase 2: Core Content Generation (The Book) (Days 3-7) -------------------------------------------------------------------------------
*Use 'content-writer' skill and 'research-validator' subagent for these.*
[ ] **Module 1 (ROS 2 Nervous System)**:
   - Write "Intro to Physical AI" (Theory).
   - Create Tutorial: "Your First ROS 2 Node" (Python).
   - Create Lab: "URDF Visualization in Rviz". [ ] **Module 2 (Digital Twin)**:
   - Write "Physics Simulation Principles".
   - Create Tutorial: "Setting up Gazebo & Unity".
   - Create Lab: "Simulating Lidar & Depth Cameras". [ ] **Module 3 (The AI Brain - Isaac)**:
   - Write "NVIDIA Isaac Sim Fundamentals".
   - Create Tutorial: "VSLAM with Isaac ROS".
   - Create Lab: "Nav2 Path Planning". [ ] **Module 4 (VLA & Capstone)**:
   - Write "Vision-Language-Action Models".
   - Create Tutorial: "Integrating OpenAI Whisper".
   - Create Capstone Guide: "The Autonomous Fetch Quest". [ ] **Asset Generation**: Generate Mermaid.js diagrams for all ROS node graphs. Phase 3: Intelligent Backend (RAG Chatbot) (Days 8-10) -------------------------------------------------------------------------------
*Use 'backend-dev' skill.*
[ ] **Backend Init**: Set up FastAPI structure (`/api`, `/services`, `/models`). [ ] **Vector DB Setup**: Configure Qdrant Cloud cluster and connection. [ ] **Ingestion Pipeline**: Create script to parse Docusaurus markdown files -> chunks -> embeddings -> Qdrant. [ ] **RAG Endpoint**: Implement `/api/chat` route with OpenAI Agent SDK.
   - Logic: Search Qdrant -> Context Window -> LLM Response. [ ] **Chat UI Widget**: Build React component (`ChatWidget.tsx`) embedded in Docusaurus layout.
   - Feature: "Select text to ask" functionality. Phase 4: User Auth & Profiling (Bonus +50pts) (Days 11-12) -------------------------------------------------------------------------------
*Use 'frontend-dev' and 'backend-dev' skills.*
[ ] **Better-Auth Setup**: Integrate `better-auth` with Neon Postgres.
   - Configure Google/GitHub OAuth providers. [ ] **Onboarding Flow**: Create "User Profile" modal upon Signup.
   - Fields: `software_level` (Beginner/Expert), `hardware_setup` (Sim/Edge/Cloud). [ ] **Profile Storage**: Save user attributes to Postgres User table. Phase 5: Adaptive Intelligence (Bonus +100pts) (Day 13) -------------------------------------------------------------------------------
*Use 'personalization-agent' and 'translation-agent'.*
[ ] **Personalization Engine**: - Build React Context to store user profile state client-side.
   - Implement `<PersonalizedBlock>` component.
   - Wrap hardware-specific content (e.g., "Edge Kit Setup") in conditional blocks. [ ] **Localization Engine**: - Implement "Translate to Urdu" button in the Navbar.
   - Create generic `TranslateService` that swaps text content or overlays Urdu translations.
   - *Note: Pre-generating Urdu MDX files is recommended for speed.* Phase 6: Quality Assurance & Submission (Day 14) -------------------------------------------------------------------------------
[ ] **Code Review**: Run `frontend-dev` check on all React components. [ ] **Plagiarism Check**: Randomly sample 10 paragraphs and check against public internet. [ ] **Fact Check**: Run `research-validator` subagent on all CLI commands in the book. [ ] **Demo Video**: Record 90s screencast: 1. Sign up (show profiling). 2. Show Personalization (content changing). 3. Show Chatbot answering a question. 4. Show Urdu toggle. [ ] **Final Deploy**: Trigger final build to GitHub Pages.

The tasks.md should be immediately executable - each task must be specific enough that an LLM can complete it without additional context.

## Task Generation Rules

**CRITICAL**: Tasks MUST be organized by user story to enable independent implementation and testing.

**Tests are OPTIONAL**: Only generate test tasks if explicitly requested in the feature specification or if user requests TDD approach.

### Checklist Format (REQUIRED)

Every task MUST strictly follow this format:

```text
- [ ] [TaskID] [P?] [Story?] Description with file path
```

**Format Components**:

1. **Checkbox**: ALWAYS start with `- [ ]` (markdown checkbox)
2. **Task ID**: Sequential number (T001, T002, T003...) in execution order
3. **[P] marker**: Include ONLY if task is parallelizable (different files, no dependencies on incomplete tasks)
4. **[Story] label**: REQUIRED for user story phase tasks only
   - Format: [US1], [US2], [US3], etc. (maps to user stories from spec.md)
   - Setup phase: NO story label
   - Foundational phase: NO story label  
   - User Story phases: MUST have story label
   - Polish phase: NO story label
5. **Description**: Clear action with exact file path

**Examples**:

- ✅ CORRECT: `- [ ] T001 Create project structure per implementation plan`
- ✅ CORRECT: `- [ ] T005 [P] Implement authentication middleware in src/middleware/auth.py`
- ✅ CORRECT: `- [ ] T012 [P] [US1] Create User model in src/models/user.py`
- ✅ CORRECT: `- [ ] T014 [US1] Implement UserService in src/services/user_service.py`
- ❌ WRONG: `- [ ] Create User model` (missing ID and Story label)
- ❌ WRONG: `T001 [US1] Create model` (missing checkbox)
- ❌ WRONG: `- [ ] [US1] Create User model` (missing Task ID)
- ❌ WRONG: `- [ ] T001 [US1] Create model` (missing file path)

### Task Organization

1. **From User Stories (spec.md)** - PRIMARY ORGANIZATION:
   - Each user story (P1, P2, P3...) gets its own phase
   - Map all related components to their story:
     - Models needed for that story
     - Services needed for that story
     - Endpoints/UI needed for that story
     - If tests requested: Tests specific to that story
   - Mark story dependencies (most stories should be independent)

2. **From Contracts**:
   - Map each contract/endpoint → to the user story it serves
   - If tests requested: Each contract → contract test task [P] before implementation in that story's phase

3. **From Data Model**:
   - Map each entity to the user story(ies) that need it
   - If entity serves multiple stories: Put in earliest story or Setup phase
   - Relationships → service layer tasks in appropriate story phase

4. **From Setup/Infrastructure**:
   - Shared infrastructure → Setup phase (Phase 1)
   - Foundational/blocking tasks → Foundational phase (Phase 2)
   - Story-specific setup → within that story's phase

### Phase Structure

- **Phase 1**: Setup (project initialization)
- **Phase 2**: Foundational (blocking prerequisites - MUST complete before user stories)
- **Phase 3+**: User Stories in priority order (P1, P2, P3...)
  - Within each story: Tests (if requested) → Models → Services → Endpoints → Integration
  - Each phase should be a complete, independently testable increment
- **Final Phase**: Polish & Cross-Cutting Concerns

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3–7 words (slug for filename)
   - Route is automatically determined by stage: 
     - `constitution` → `history/prompts/constitution/`
     - Feature stages → `history/prompts/<feature-name>/` (spec, plan, tasks, red, green, refactor, explainer, misc)
     - `general` → `history/prompts/general/`

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path based on stage from step 2; write the file
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/` and matches stage; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.

## Response snapshot

Generated `tasks.md` for AI Robotics Learning Environment with 43 tasks organized into 10 phases and 7 user stories.

## Outcome

- ✅ Impact: Generated a detailed `tasks.md` with clear, actionable steps for the AI Robotics Learning Environment.
- 🧪 Tests: No tests were generated as per the prompt instructions (tests are optional).
- 📁 Files: One file created: `specs/001-ai-robotics-learning/tasks.md`.
- 🔁 Next prompts: Proceed with implementing tasks from the generated `tasks.md`.
- 🧠 Reflection: The task generation process successfully translated the high-level outline into a structured and detailed task list, adhering to the specified format and organizational principles. The use of specific file paths and clear task descriptions will facilitate implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None.
- Graders run and results (PASS/FAIL): Not applicable.
- Prompt variant (if applicable): Not applicable.
- Next experiment (smallest change to try): Not applicable.

```