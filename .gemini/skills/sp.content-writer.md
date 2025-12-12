---
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
   - **User Input for Ambiguity**: If the learning objective is unclear, too broad, or too niche, clarify with the user before proceeding.
2. **Explain Concept Simply**
3. **Go Deep with Technical Insights**
   - **Research**: Utilize `google_web_search` for gathering in-depth information and verifying technical accuracy.
4. **Add Real Robotics Examples**
   - **Research**: Utilize `google_web_search` for relevant and current examples.
5. **Add Diagrams (ASCII if needed)**
   - **Generation**: Generate ASCII diagrams directly within the markdown content, or describe visual diagrams if external tools are implied.
6. **Summarize Key Points**

## Output Format
- **Overall Structure**: Markdown file.
- **Title**: H1 heading (`# Title`)
- **Intro**: Paragraph(s) introducing the topic.
- **Sections**: H2 headings (`## Section Title`) for main sections, H3 (`### Sub-section Title`) for sub-sections.
- **Diagrams**: Embedded directly as ASCII art or as descriptive text blocks.
- **Summary**: A concise paragraph or bullet points recapitulating the main ideas.


## Quality Criteria
- Easy to understand  
- Technically accurate  
- Clear flow  
- Educational

## Example Usage

**User Prompt:** "Write a section about 'Inverse Kinematics in Robotics' for a beginner's textbook. Include a simple explanation, technical details, a real-world example, and an ASCII diagram."

**Agent Action (internal):**
1. Define Learning Objective: Explain Inverse Kinematics to beginners in robotics.
2. Explain Concept Simply: Start with a high-level overview.
3. Go Deep: Introduce Jacobian matrix, pseudo-inverse, common algorithms.
4. Add Examples: Robotic arm painting, humanoid robot walking.
5. Add Diagrams: Create a simple ASCII diagram of a 2-DOF arm.
6. Summarize: Key takeaways about IK's role and challenges.

**Expected Output (conceptual, truncated for brevity):**

```markdown
# Inverse Kinematics in Robotics

## Introduction
Inverse Kinematics (IK) is a fundamental concept in robotics that deals with calculating the joint angles of a robotic arm to reach a desired position and orientation in space. Imagine you want a robot's hand to touch a specific point; IK helps figure out how each joint in the arm needs to bend to achieve that.

## Technical Insights
Inverse Kinematics is typically more complex than Forward Kinematics because it involves solving a set of non-linear equations. For a robotic arm with 'n' joints, the forward kinematics provides a mapping from joint space to task space. Inverse kinematics attempts to find the inverse mapping.

Common approaches include:
- **Analytical Solutions**: Possible for simpler robots (e.g., 3-DOF planar arm). Provide direct, closed-form solutions.
- **Numerical Solutions**: Required for more complex robots. Involve iterative methods that minimize the error between the current end-effector pose and the desired pose. Often uses the Jacobian matrix, which relates joint velocities to end-effector velocities.

## Real Robotics Examples
- **Industrial Robotic Arms**: In manufacturing, IK is crucial for tasks like welding, painting, or assembly, where the robot's end-effector needs to precisely follow a trajectory.
- **Humanoid Robots**: For tasks like walking, balancing, or grasping, humanoid robots use IK to compute the necessary joint configurations for their arms and legs to maintain balance and interact with the environment.

## Diagram: 2-DOF Robotic Arm (Planar)

```
  O----(L1)----J1----(L2)----E
  |            /
  |           / θ1
  |          /
  J0--------
```
* J0: Base joint
* J1: Elbow joint
* O: Origin
* E: End-effector
* L1, L2: Link lengths
* θ1, θ2: Joint angles (θ2 would be relative to L1)

## Summary
Inverse Kinematics is essential for making robots perform tasks requiring precise end-effector placement. While challenging due to its mathematical complexity, various analytical and numerical methods allow robots to achieve sophisticated movements and interactions.
```