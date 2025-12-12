---
id: 001
title: Initial project constitution
stage: constitution
date: 2025-12-10
surface: agent
model: gemini
feature: none
branch: 001-physical-ai-textbook
user: Ammaz737
command: /sp.constitution
labels: ["documentation", "constitution"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
  - .specify/templates/spec-template.md
  - .specify/templates/tasks-template.md
  - .gemini/commands/sp.adr.toml
  - .gemini/commands/sp.analyze.toml
  - .gemini/commands/sp.checklist.toml
  - .gemini/commands/sp.clarify.toml
  - .gemini/commands/sp.constitution.toml
  - .gemini/commands/sp.git.commit_pr.toml
  - .gemini/commands/sp.implement.toml
  - .gemini/commands/sp.phr.toml
  - .gemini/commands/sp.plan.toml
  - .gemini/commands/sp.specify.toml
  - .gemini/commands/sp.tasks.toml
tests:
  - none
---

## Prompt

/sp.constitution                                                                                                                                                                                                                    Project: Physical AI & Humanoid Robotics: An AI-Native Textbook Platform

Mission:
To create a comprehensive, interactive, and AI-powered textbook that bridges the gap between digital AI agents and embodied humanoid robotics, enabling students to master ROS 2, NVIDIA Isaac, and VLA models.

Core Principles:
- Embodied Intelligence: All concepts must connect abstract AI code to physical or simulated reality (Sim-to-Real).
- Interactive Learning: The book is not static; it must converse, adapt, and personalize content for the reader.
- Technical Rigor: Strict adherence to industry standards (ROS 2 Humble/Iron, NVIDIA Isaac Sim) to ensure employability.
- Accessibility: Complex topics (Kinematics, SLAM) must be broken down for students with varying software/hardware backgrounds.

Key Standards:

1. Architecture & Tech Stack:
   - Frontend/Content: Docusaurus (deployed to GitHub Pages).
   - Backend/RAG: FastAPI, OpenAI Agents/ChatKit SDKs.
   - Database: Neon Serverless Postgres (User data), Qdrant Cloud (Vector store).
   - Auth: Better-Auth (Signup/Signin with background profiling).
   - Infrastructure: Cloud-compatible but hardware-aware (RTX 40 series/Jetson Orin optimizations).

2. Functional Requirements (Hackathon Bonus Integration):
   - RAG Chatbot: Must answer questions based on specific text selections or the whole book.
   - Personalization:
     - Upon Signup: Capture "Software Background" (e.g., Python vs. C++) and "Hardware Setup" (e.g., Simulation only vs. Edge Kit).
     - Dynamic Content: "Personalize" button at chapter start adjusts difficulty or code examples based on the user profile.
   - Localization: "Translate to Urdu" button available at the start of every chapter.

3. Content Structure:
   - Modular Design: Follows the 4-Module structure (ROS 2, Gazebo/Unity, NVIDIA Isaac, VLA).
   - Hands-on Capstones: Every module must end with a practical lab (Simulated or Physical).
   - Hardware Awareness: Clearly distinguish instructions for "Digital Twin Workstations" (RTX GPU) vs. "Edge Kits" (Jetson Orin).

4. Coding Standards (for Code Snippets):
   - Language: Python (rclpy) primarily, C++ where performance is critical.
   - Format: PEP 8 compliant.
   - Documentation: All code blocks must include comments explaining the "Why" alongside the "How."
   - Error Handling: robust handling for sensor timeouts and connection failures.

Constraints:
- Word Count: Comprehensive coverage of the 13-week syllabus.
- Visuals: Descriptions for diagrams/screenshots must be included where images cannot be generated.
- Plagiarism: 0% tolerance; content must be synthesized from accepted technical documentation (ROS 2 Docs, NVIDIA Isaac Docs).
- Deadline Awareness: Focus on MVP (Minimum Viable Product) functionality first, then polish.

Success Criteria:
- Deployment: Fully functional Docusaurus site on GitHub Pages.
- Intelligence: RAG Chatbot successfully answers queries about specific ROS 2 commands defined in the text.
- User Flow: Users can sign up, define their hardware, and see content tailored to that hardware.
- Localization: Instant translation of technical concepts into Urdu without losing meaning.

Reference Material Scope:
- ROS 2 Documentation (Humble/Iron)
- NVIDIA Isaac Sim & Isaac ROS Documentation
- Unitree Robotics SDKs
- OpenAI API Documentation (for VLA/Whisper integration)

## Response snapshot

The project constitution has been successfully updated to version 1.0.0, incorporating core principles, technical specifications, and governance rules. A manual follow-up is required for `plan-template.md`.

## Outcome

- ✅ Impact: Created the initial project constitution (`.specify/memory/constitution.md`) based on user input, defining core principles, technical standards, and governance. Performed consistency check on related templates.
- 🧪 Tests: No automated tests were run for this constitution update. Manual review of templates performed.
- 📁 Files: Modified `.specify/memory/constitution.md`. Reviewed `.specify/templates/plan-template.md`, `.specify/templates/spec-template.md`, `.specify/templates/tasks-template.md`, and all `.gemini/commands/*.toml` files.
- 🔁 Next prompts: User to address manual follow-up for `plan-template.md` and then proceed with further feature development.
- 🧠 Reflection: The agent successfully parsed complex, multi-section user input and mapped it to a structured template. The failure of the bash script `create-phr.sh` highlighted the need for robust cross-platform scripting or agent-native PHR creation.

## Evaluation notes (flywheel)

- Failure modes observed: Attempted to use `create-phr.sh` (bash script) on a Windows system, resulting in a 'command not found' error. This indicates a platform compatibility issue for shell scripts.
- Graders run and results (PASS/FAIL): N/A (no specific graders for this task)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Implement a PowerShell version of `create-phr.sh` or integrate agent-native PHR creation more deeply to avoid shell script dependencies across platforms.