import TranslateBlock from '@site/src/components/Translate/TranslateBlock';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
// import HomepageFeatures from '@site/src/components/HomepageFeatures'; // Removed
import Heading from '@theme/Heading';
import TerminalBlock from '@site/src/components/TerminalBlock'; // New import

import LearningObjectives from '@site/src/components/LearningObjectives'; // New import

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="background-pattern" />
      <div className={clsx('container', styles.heroContainer)}>
        <h1 className={clsx('hero__title', styles.heroTitle)}>
          {siteConfig.title}
        </h1>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
          <TranslateBlock en="From Code to Reality" ur="کوڈ سے حقیقت تک" />
        </p>
        <div className={styles.buttons}>
          <Link
            className={clsx('button button--primary button--lg', styles.heroButton)}
            to="/docs/module1/intro-ros2">
            Start Learning
          </Link>
          <Link
            className={clsx('button button--outline button--secondary button--lg', styles.heroButton)}
            to="/docs/module1/intro-ros2">
            Explore Docs
          </Link>
        </div>
        {/* Placeholder for subtle animation - will add a code block here later */}
        <div className={styles.heroAnimation}>
          <TerminalBlock>
            <span className={styles.codeLine}>&gt; python robot_control.py</span>
            <span className={styles.codeLine}>Loading AI modules... Done.</span>
            <span className={styles.codeLine}>Initializing robotic arm (2-DOF)... Done.</span>
            <span className={styles.codeLine}>Ready for commands.</span>
          </TerminalBlock>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`} // Updated title
      description="Learn AI, Robotics, and Control Systems with hands-on simulations."> {/* Updated description */}
      <HomepageHeader />
      <main className={styles.homepageMain}>
        <LearningObjectives />
      </main>
    </Layout>
  );
}
