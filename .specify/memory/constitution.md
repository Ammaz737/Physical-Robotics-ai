<!--
Sync Impact Report:
Version change: 1.0.0 -> 1.1.0
List of modified principles:
  - Embodied Intelligence (added rationale)
  - Interactive Learning (added rationale)
  - Technical Rigor (added rationale)
  - Accessibility (added rationale)
Added sections:
  - Constitution Versioning (under Governance)
  - Deviation and Exception Process (under Governance)
  - Evolution and Review Cycle (under Governance)
Removed sections: None
Templates requiring updates:
  - plan-template.md: ⚠ pending (Constitution Check section needs to refer to new principles)
Follow-up TODOs: None
-->
# Physical AI & Humanoid Robotics: An AI-Native Textbook Platform Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### Embodied Intelligence
All concepts must connect abstract AI code to physical or simulated reality (Sim-to-Real). This ensures that theoretical knowledge is always grounded in practical application, crucial for robotics.

### Interactive Learning
The book is not static; it must converse, adapt, and personalize content for the reader. This fosters deeper understanding and retention by adapting to individual student needs and learning styles.

### Technical Rigor
Strict adherence to industry standards (ROS 2 Humble/Iron, NVIDIA Isaac Sim) to ensure employability. Adherence to industry standards prepares students for real-world engineering challenges and career opportunities.

### Accessibility
Complex topics (Kinematics, SLAM) must be broken down for students with varying software/hardware backgrounds. Breaking down complex topics makes the material approachable for a wider audience, promoting inclusivity in STEM.

## Key Standards and Technical Specifications

### Architecture & Tech Stack:
- Frontend/Content: Docusaurus (deployed to GitHub Pages).
- Backend/RAG: FastAPI, OpenAI Agents/ChatKit SDKs.
- Database: Neon Serverless Postgres (User data), Qdrant Cloud (Vector store).
- Auth: Better-Auth (Signup/Signin with background profiling).
- Infrastructure: Cloud-compatible but hardware-aware (RTX 40 series/Jetson Orin optimizations).

### Functional Requirements (Hackathon Bonus Integration):
- RAG Chatbot: Must answer questions based on specific text selections or the whole book.
- Personalization:
  - Upon Signup: Capture "Software Background" (e.g., Python vs. C++) and "Hardware Setup" (e.g., Simulation only vs. Edge Kit).
  - Dynamic Content: "Personalize" button at chapter start adjusts difficulty or code examples based on the user profile.
- Localization: "Translate to Urdu" button available at the start of every chapter.

### Content Structure:
- Modular Design: Follows the 4-Module structure (ROS 2, Gazebo/Unity, NVIDIA Isaac, VLA).
- Hands-on Capstones: Every module must end with a practical lab (Simulated or Physical).
- Hardware Awareness: Clearly distinguish instructions for "Digital Twin Workstations" (RTX GPU) vs. "Edge Kits" (Jetson Orin).

### Coding Standards (for Code Snippets):
- Language: Python (rclpy) primarily, C++ where performance is critical.
- Format: PEP 8 compliant.
- Documentation: All code blocks must include comments explaining the "Why" alongside the "How."
- Error Handling: robust handling for sensor timeouts and connection failures.

## Project Constraints and Success Criteria

### Constraints:
- Word Count: Comprehensive coverage of the 13-week syllabus.
- Visuals: Descriptions for diagrams/screenshots must be included where images cannot be generated.
- Plagiarism: 0% tolerance; content must be synthesized from accepted technical documentation (ROS 2 Docs, NVIDIA Isaac Docs).
- Deadline Awareness: Focus on MVP (Minimum Viable Product) functionality first, then polish.

### Success Criteria:
- Deployment: Fully functional Docusaurus site on GitHub Pages.
- Intelligence: RAG Chatbot successfully answers queries about specific ROS 2 commands defined in the text.
- User Flow: Users can sign up, define their hardware, and see content tailored to that hardware.
- Localization: Instant translation of technical concepts into Urdu without losing meaning.

### Reference Material Scope:
- ROS 2 Documentation (Humble/Iron)
- NVIDIA Isaac Sim & Isaac ROS Documentation
- Unitree Robotics SDKs
- OpenAI API Documentation (for VLA/Whisper integration)

## Governance
This Constitution supersedes all other project practices. Amendments require formal documentation, approval by core maintainers (project leads and module owners), and a migration plan for affected components. All pull requests and code reviews must verify compliance with these principles, utilizing automated checks (e.g., linters) and manual review against defined checklists. Justification is required for any complexity introduced. Runtime development guidance can be found in `README.md` and `docs/quickstart.md` (if they exist).

### Constitution Versioning
The Constitution itself will follow Semantic Versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Backward incompatible changes (removal/redefinition of principles).
- **MINOR**: New principles/sections added or materially expanded guidance.
- **PATCH**: Clarifications, wording improvements, typo fixes, non-semantic refinements.

### Deviation and Exception Process
Any proposed deviation from a principle must be formally documented, include a clear rationale, assess potential impacts, and be approved by a majority of core maintainers. Approved deviations will be time-boxed and regularly reviewed.

### Evolution and Review Cycle
This Constitution will undergo a formal review annually, or upon significant project milestones, to ensure its continued relevance, accuracy, and effectiveness.
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: 1.1.0 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-10
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->