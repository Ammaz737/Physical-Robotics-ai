# Tasks for AI Agents & Humanoid Robotics: A Text-Based Learning Environment

**Feature Name**: AI Agents & Humanoid Robotics: A Text-Based Learning Environment
**Date**: 2025-12-10
**Spec**: specs/001-ai-robotics-learning/spec.md
**Plan**: specs/001-ai-robotics-learning/plan.md

## Implementation Strategy

This implementation will follow an iterative approach, focusing on delivering core UI aesthetics first, then implementing user stories in priority order (P1 first, then P2). Each phase will aim for independently testable increments.

## Phases

### Phase 1: High-Fidelity Frontend Design (The "Look")
*Goal: Create a "Cyberpunk/Robotics Lab" aesthetic before adding complex logic.*

- [X] T001 Update `src/css/custom.css` with the "Neon/Dark" palette.
- [X] T002 Configure `docusaurus.config.ts` to force Dark Mode.
- [X] T003 Add `Inter` and `JetBrains Mono` fonts in `docusaurus.config.ts` and/or `src/css/custom.css`.
- [X] T004 Add `[⚙️ Personalize]` button to Navbar (left of Search) in `docusaurus.config.ts`.
- [X] T005 Add `[اردو Translate]` button to Navbar (right of Search) in `docusaurus.config.ts`.
- [X] T006 Add "Panaversity AI-Native" branding to Footer in `docusaurus.config.ts`.
- [X] T007 Create `src/components/HardwareBadge.tsx` component.
- [X] T008 Create `src/components/TerminalBlock.tsx` component.

### Phase 2: Homepage Redesign
*Goal: Transform the default homepage into a polished, purposeful design reflecting advanced technology, intelligent systems, and robotics engineering.*

- [X] T009 Update `physical-ai-textbook/docusaurus.config.ts` for site title and tagline.
- [X] T010 Redesign `physical-ai-textbook/src/pages/index.tsx` (Hero section, new sections, animation).
- [X] T011 Create `physical-ai-textbook/src/components/LearningObjectives.tsx` for cards/grids.
- [X] T012 Update `physical-ai-textbook/src/css/custom.css` for new homepage elements.
- [X] T013 Redesign the footer in `physical-ai-textbook/docusaurus.config.ts` and `src/css/custom.css`.

### Phase 3: Core Content Generation (The "Body")
*Goal: Write the 4 Modules using the Syllabus. Strictly follow Primary Source Verification.*

- [X] T014 Create `docs/module1/intro-ros2.md`: Intro to Nodes/Topics.
- [X] T015 Create `docs/module1/lab-setup.md`: Distinguish between "Sim Rig" vs "Edge Kit".
- [X] T016 Create `docs/module2/urdf-creation.md`.
- [X] T017 Create `docs/module2/gazebo-physics.md`.
- [X] T018 Create `docs/module3/isaac-sim-setup.md`: Explicit warning about RTX 4070 req.
- [X] T019 Create `docs/module3/nav2-slam.md`.
- [X] T020 Create `docs/module4/vla-integration.md` (OpenAI Whisper + ROS 2).
- [X] T021 Create `docs/module4/capstone-project.md` (The Autonomous Humanoid).

### Phase 4: Auth, Backend & Profiling (The "Identity")
*Goal: Implement Better-Auth and capture User Hardware Profiles.*

- [X] T022 Initialize FastAPI in `/backend` folder.
- [X] T023 Set up Neon Postgres connection using SQLAlchemy in the backend.
- [X] T024 Implement Signup/Login endpoints in the backend.
- [X] T025 Customize Signup Flow (coding background, hardware) and store in `user_profiles` table in the backend.
- [X] T026 Create `src/components/Auth/LoginModal.tsx` in the frontend.
- [X] T027 Protect `docs/module4` (Capstone) so only logged-in users can view it in the frontend.

### Phase 5: User Story 1 - Kinematics Simulation (Priority: P1)
*Goal: Enable users to experiment with and understand basic kinematics of a 2-DOF robotic arm.*

- [ ] T028 [US1] Implement `move_joint` command interpretation for 2-DOF robotic arm.
- [ ] T029 [US1] Implement `get_position` command interpretation for 2-DOF robotic arm.
- [ ] T030 [US1] Develop visual representation (ASCII/simple graphics) of 2-DOF robotic arm movement.

### Phase 6: User Story 2 - Sensor Interpretation (Priority: P1)
*Goal: Enable users to experiment with and understand how robots interpret their environment using simple simulated distance sensors.*

- [ ] T031 [US2] Implement `read_sensor` command interpretation for simulated distance sensors.
- [ ] T032 [US2] Develop visual obstruction cues for sensor feedback.

### Phase 7: User Story 3 - Simplified Task Planning (Priority: P2)
*Goal: Enable users to sequence basic commands to achieve higher-level goals, demonstrating simplified AI task planning concepts.*

- [ ] T033 [US3] Implement `detect_object` command interpretation.
- [ ] T034 [US3] Implement `pick_up` command interpretation with visual state changes.
- [ ] T035 [US3] Implement `place_down` command interpretation with visual state changes.

### Phase 8: Polish & Cross-Cutting Concerns
*Goal: Refine the user experience and ensure core functional requirements are met.*

- [ ] T036 Integrate basic in-browser text editor with syntax highlighting (if not covered by Docusaurus default or Monaco Editor).
- [ ] T037 Implement debugging features (step-by-step execution, variable inspection).
- [ ] T038 Ensure structural outline for content delivery (Introduction, Modules).
- [X] T039 Update `sidebars.ts` to include the new content modules (ROS 2, Gazebo, Isaac Sim, VLA & Capstone).

## Task Dependencies

- Phase 1 tasks are foundational for the UI aesthetic.
- Phase 2 tasks depend on Phase 1 completion (for UI components).
- Phase 3 tasks depend on Phase 1 completion and potentially Phase 2 for a fully integrated UI.
- Phase 4 tasks depend on Phase 1, Phase 2 (for UI components), and Phase 3 (for potentially protected content).
- Phase 5 tasks depend on Phase 1, Phase 2 & 3 for context.
- Phase 6 tasks depend on Phase 1, and ideally, a working kinematics (Phase 5) and sensor (Phase 6) system.
- Phase 7 tasks depend on Phase 1, and ideally, working kinematics (Phase 5) and sensor (Phase 6) systems.
- Phase 8 tasks can run in parallel with later story phases but should be completed for a polished final product.

## Parallel Execution Opportunities

- T007 and T008 (component creation) can be done in parallel.
- T010, T011, T012, T013 related to homepage redesign can be done concurrently to some extent.
- The content creation tasks in Phase 3 (T014-T021) can be done in parallel.
- Within Phase 4, backend tasks (T022-T025) and frontend tasks (T026-T027) can be done in parallel to some extent.
- Within each user story phase, tasks related to different parts of the system (e.g., command interpretation vs. visual representation) might be parallelizable if done by different developers, but for a single agent, sequential is often simpler.

## Independent Test Criteria per Story

- **User Story 1 (Kinematics Simulation)**: A user can execute `move_joint` and `get_position` commands and observe correct visual feedback of the 2-DOF arm movement within the simulated environment.
- **User Story 2 (Sensor Interpretation)**: A user can execute `read_sensor` commands and observe accurate numerical distance readings and appropriate visual obstruction cues within the simulated environment.
- **User Story 3 (Simplified Task Planning)**: A user can issue a sequence of task-planning commands (`pick_up`, `place_down`, `detect_object`) to achieve a simple goal (e.g., "pick up a block") and receive appropriate success/failure messages and observe visual state changes.

## Suggested MVP Scope

The Minimum Viable Product (MVP) would primarily encompass Phase 1 and Phase 2 (Homepage Redesign) and Phase 5 (User Story 1 - Kinematics Simulation), as this establishes the core aesthetic, homepage experience, and fundamental interaction with the robotic arm. The Auth and Backend (Phase 4) would be a crucial next step for personalization.
