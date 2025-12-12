import React from 'react';
import { useLanguage } from '@site/src/context/LanguageContext';
import styles from './Navbar.module.css';

export default function TranslateButton() {
  const { isUrdu, toggleLanguage } = useLanguage();

  return (
    <div className="navbar__item">
      <a
        className={`navbar__link ${styles.navbarLink}`}
        onClick={toggleLanguage}
        style={{ cursor: 'pointer' }}>
        {isUrdu ? 'English' : 'اردو Translate'}
      </a>
    </div>
  );
}
