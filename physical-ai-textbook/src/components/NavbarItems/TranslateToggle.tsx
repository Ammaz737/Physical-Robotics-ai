import React from 'react';
import { useLanguage } from '@site/src/context/LanguageContext';
import styles from './TranslateToggle.module.css';

const TranslateToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button className={styles.translateButton} onClick={toggleLanguage}>
      {language === 'en' ? 'اردو' : 'EN'}
    </button>
  );
};

export default TranslateToggle;
