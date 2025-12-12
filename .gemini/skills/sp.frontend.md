---
name: "frontend"
description: "Build high-quality frontends using React, Next.js, Tailwind, and component-driven architecture."
version: "1.0.0"
---

# Frontend Skill

## When to Use
- Build UI pages
- Fix bugs
- Convert design → code
- Componentize logic
- Optimize performance

## Process
1. **Read Requirements**
   - **Adhere to Project Conventions**: Analyze existing frontend frameworks, component libraries, styling, and testing practices within the project.
   - **User Input for Ambiguity**: If requirements are unclear or multiple implementation paths exist, present options and ask the user for their preference.
2. **Break Into Components**
3. **Define Props & State**
4. **Write Clean, Typed Code**  
   Prefer TypeScript.
   - **Tool Usage**: Utilize `write_file` for new files or `replace` for modifications.
5. **Add Styles (Tailwind / Module CSS)**
   - **Tool Usage**: Utilize `write_file` for new files or `replace` for modifications.
6. **Test Rendering**
   - **Verification**: If automated tests exist, identify and run relevant tests using `run_shell_command`. Provide descriptive output for manual verification or mockups.
7. **Optimize (memo, lazy, skeleton)**

## Output
- **Code**: Full file content(s) for created or modified components/files.
- **Explanation**: A markdown-formatted explanation of the implemented solution, design choices, and how to use it.
- **Folder structure**: A tree-like text representation of any new or modified directories and files.


## Quality Criteria
- Pixel-perfect  
- Clean architecture  
- Low re-renders  
- Fully responsive

## Example Usage

**User Prompt:** "Implement a responsive `UserProfileCard` component in React using TypeScript and Tailwind CSS. It should display the user's avatar, name, and email. The component should be reusable and placed in `src/components/UserProfileCard.tsx`."

**Agent Action (internal):**
1. Read Requirements: User wants a `UserProfileCard` component with specific fields, technologies, and file path.
2. Break Into Components: The request is for a single component.
3. Define Props & State: Props will include `avatarUrl`, `name`, `email`. No internal state needed.
4. Write Clean, Typed Code: Create `src/components/UserProfileCard.tsx` with React functional component, TypeScript types for props, and Tailwind classes for styling.
5. Add Styles: Use Tailwind CSS classes for layout, typography, and responsive adjustments.
6. Test Rendering: Provide code for a simple Storybook story or a test file for visual inspection.
7. Optimize: Consider `React.memo` if the component is re-rendered frequently with the same props.

**Expected Output (conceptual):**

```
Explanation:
Created a `UserProfileCard` component following the specified requirements. It's a functional React component written in TypeScript, styled with Tailwind CSS, and designed to be responsive and reusable.

Code:
(Content of src/components/UserProfileCard.tsx)
```typescript
import React from 'react';

interface UserProfileCardProps {
  avatarUrl: string;
  name: string;
  email: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ avatarUrl, name, email }) => {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
      <img
        className="w-16 h-16 rounded-full"
        src={avatarUrl}
        alt={`${name}'s avatar`}
      />
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h2>
        <p className="text-gray-600 dark:text-gray-400">{email}</p>
      </div>
    </div>
  );
};

export default UserProfileCard;
```

```
Folder structure:
src/
└── components/
    └── UserProfileCard.tsx
```