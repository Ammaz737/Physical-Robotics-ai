import React from 'react';
import clsx from 'clsx';
import styles from './LearningObjectives.module.css';

interface LearningObjective {
  title: string;
  description: string;
  icon?: string; // Optional icon, could be an SVG path or a class name
}

const LearningObjectivesData: LearningObjective[] = [
  {
    title: 'AI Agents & Decision Making',
    description: 'Understand how intelligent agents perceive, act, and make decisions in complex environments.',
    icon: '🧠',
  },
  {
    title: 'Robotics Control Systems',
    description: 'Explore the principles of robot kinematics, dynamics, and control for precise movement.',
    icon: '⚙️',
  },
  {
    title: 'Sensor Integration & Perception',
    description: 'Learn to process sensor data to enable robots to understand and interact with their surroundings.',
    icon: '👁️',
  },
  {
    title: 'Humanoid Movement & Biomechanics',
    description: 'Dive into the challenges and solutions for replicating human-like motion in robotic platforms.',
    icon: '🚶',
  },
  {
    title: 'Ethical AI in Robotics',
    description: 'Address the critical ethical considerations in designing and deploying autonomous AI systems.',
    icon: '🛡️',
  },
  {
    title: 'Future of Physical AI',
    description: 'Gaze into emerging trends and the transformative impact of physical AI on industries and society.',
    icon: '🔮',
  },
];

export default function LearningObjectives(): JSX.Element {
  return (
    <section className={styles.learningObjectivesSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>What You'll Master</h2>
        <div className={styles.grid}>
          {LearningObjectivesData.map((objective, idx) => (
            <div key={idx} className={styles.card}>
              <h3 className={styles.cardTitle}>{objective.title}</h3>
              <p className={styles.cardDescription}>{objective.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
