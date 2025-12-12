import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [

    {
      type: 'category',
      label: 'Module 1: The Robotic Nervous System',
      items: [
        'module1/intro-ros2',
        'module1/lab-setup',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: The Digital Twin',
      items: [
        'module2/urdf-creation',
        'module2/gazebo-physics',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: The AI-Robot Brain',
      items: [
        'module3/isaac-sim-setup',
        'module3/nav2-slam',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: VLA & Capstone',
      items: [
        'module4/vla-integration',
        'module4/capstone-project',
      ],
    },
    // The existing tutorial-basics and tutorial-extras
  ],
};

export default sidebars;
