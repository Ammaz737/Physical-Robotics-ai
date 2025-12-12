---
id: 005
title: Create Content Writer Skill
stage: misc
date: 2025-12-10
surface: agent
model: gemini-1.5-flash
feature: none
branch: unknown
user: unknown
command: create next skill                                                                                                                                                                       ---
name: "content-writer"
description: "Write structured, engaging, technically accurate textbook content for AI, robotics, and agents."
version: "1.0.0"
---

# Content Writer Skill

## When to Use
- Writing chapters
- Theory explanations
- Diagrams, examples
- Concept summaries

## Process
1. **Define Learning Objective**
2. **Explain Concept Simply**
3. **Go Deep with Technical Insights**
4. **Add Real Robotics Examples**
5. **Add Diagrams (ASCII if needed)**
6. **Summarize Key Points**

## Output Format
- Title  
- Intro  
- Sections  
- Diagrams  
- Summary  

## Quality Criteria
- Easy to understand  
- Technically accurate  
- Clear flow  
- Educational
labels: ["skill-creation", "content-writer"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
- .gemini/skills/sp.content-writer.md
tests:

---

## Prompt

create next skill                                                                                                                                                                       ---
name: "content-writer"
description: "Write structured, engaging, technically accurate textbook content for AI, robotics, and agents."
version: "1.0.0"
---

# Content Writer Skill

## When to Use
- Writing chapters
- Theory explanations
- Diagrams, examples
- Concept summaries

## Process
1. **Define Learning Objective**
2. **Explain Concept Simply**
3. **Go Deep with Technical Insights**
4. **Add Real Robotics Examples**
5. **Add Diagrams (ASCII if needed)**
6. **Summarize Key Points**

## Output Format
- Title  
- Intro  
- Sections  
- Diagrams  
- Summary  

## Quality Criteria
- Easy to understand  
- Technically accurate  
- Clear flow  
- Educational

## Response snapshot

Successfully created and wrote to new file: C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\.gemini\skills\sp.content-writer.md.

## Outcome

- ✅ Impact: Skill definition for Content Writer created.
- 🧪 Tests: No specific tests for skill creation.
- 📁 Files: 1 file created.
- 🔁 Next prompts: N/A
- 🧠 Reflection: Created new skill definition for content writing.

## Evaluation notes (flywheel)

- Failure modes observed: N/A
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
