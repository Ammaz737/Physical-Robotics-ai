---
id: 001
title: Create UI Designer Skill
stage: misc
date: 2025-12-10
surface: agent
model: gemini-1.5-flash
feature: none
branch: unknown
user: unknown
command: create skill
labels: ["skill-creation", "ui-designer"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
- .gemini/skills/sp.ui-designer.md
tests:

---

## Prompt

create skill                                                                                                                                                                            ---
name: "ui-designer"
description: "Design clean, modern, accessible UI layouts and components with strong frontend instincts. Ideal for Docusaurus, dashboards, mobile-first UIs, and high-tech aesthetics."
version: "1.0.0"
---

# UI Designer Skill

## When to Use
- User asks to design components/pages
- Styling issues, layout fixes, visual improvements
- Converting ideas → UI mockups
- Creating reusable design patterns

## Process
1. **Understand Intent**  
   Clarify purpose (info, action, navigation)

2. **Define Visual Hierarchy**  
   Primary > Secondary > Danger > Info

3. **Choose Aesthetic**  
   Use "High-Tech Robotics" + Dark Compatible theme  
   - Clean spacing  
   - Rounded corners  
   - Subtle shadows  
   - Robotics-blue accents  

4. **Output Code**  
   - React + Tailwind (preferred)  
   - Or CSS module + JSX  

5. **Usability & Accessibility Check**  
   - WCAG contrast  
   - Mobile-first  
   - Touch target ≥ 44px  

## Output Format
- Design logic (short reasoning)
- React + Tailwind code
- How the UI should look (text preview)

## Quality Criteria
- Visually consistent  
- Accessible  
- Minimalist  
- Pixel-aligned  
- Reusable components

## Response snapshot

Successfully created and wrote to new file: C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\.gemini\skills\sp.ui-designer.md.

## Outcome

- ✅ Impact: Skill definition for UI Designer created.
- 🧪 Tests: No specific tests for skill creation.
- 📁 Files: 1 file created.
- 🔁 Next prompts: N/A
- 🧠 Reflection: User corrected the skill storage directory from `commands` to `skills`.

## Evaluation notes (flywheel)

- Failure modes observed: Incorrect initial directory for skill storage.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
