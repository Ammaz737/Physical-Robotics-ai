---
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
   Clarify purpose (info, action, navigation).
   - **Adhere to Project Conventions**: Analyze existing UI patterns, component libraries, and styling within the project.

2. **Define Visual Hierarchy**  
   Primary > Secondary > Danger > Info.
   - **User Input for Ambiguity**: If multiple valid design approaches exist or decisions are complex, present options and ask the user for their preference.

3. **Choose Aesthetic**  
   Use "High-Tech Robotics" + Dark Compatible theme  
   - Clean spacing  
   - Rounded corners  
   - Subtle shadows  
   - Robotics-blue accents  

4. **Output Code**  
   - Generate React + Tailwind code (preferred) or CSS module + JSX.
   - **Tool Usage**: Utilize `write_file` for new files or `replace` for modifications, adhering to existing project structure and conventions.

5. **Usability & Accessibility Check**  
   - WCAG contrast  
   - Mobile-first  
   - Touch target ≥ 44px  

## Output Format
- Design logic (short reasoning).
- React + Tailwind code or CSS module + JSX.
- **Visual Preview**: A concise, descriptive text preview of the UI, focusing on layout, key elements, and their arrangement. (e.g., "A header with logo on left, nav links on right...").

## Quality Criteria
- Visually consistent  
- Accessible  
- Minimalist  
- Pixel-aligned  
- Reusable components

## Example Usage

**User Prompt:** "Design a simple dashboard layout for a robotics monitoring system. It should display key metrics like robot status (online/offline), battery level, and last known location, using the 'High-Tech Robotics' aesthetic."

**Agent Action (internal):**
1. Understand Intent: User wants a dashboard layout for robotics monitoring, with specific metrics and aesthetic.
2. Define Visual Hierarchy: Robot status (critical info) > Battery level (important) > Location (contextual).
3. Choose Aesthetic: Apply "High-Tech Robotics" theme.
4. Output Code: Generate React/Tailwind for a 3-column layout with cards for each metric.
5. Usability & Accessibility Check: Ensure contrast and responsiveness.

**Expected Output (conceptual):**

```
Design Logic:
- Used a grid-based layout for clear separation of metric cards.
- Applied dark theme with blue accents for the high-tech feel.
- Ensured responsive design for various screen sizes.

React + Tailwind Code:
(Generates React component code with Tailwind classes for the dashboard)

Visual Preview:
A full-width header with "Robotics Monitoring Dashboard" title.
Below the header, a 3-column grid layout:
- Column 1: "Robot Status" card with a large icon (green for online, red for offline) and text.
- Column 2: "Battery Level" card with a progress bar and percentage display.
- Column 3: "Last Location" card with text coordinates and a placeholder for a map (if applicable).
Each card features rounded corners, subtle shadow, and a border in robotics-blue.
```