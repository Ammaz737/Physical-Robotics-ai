import React, { useContext } from 'react';
import { AppContext, AppContextType } from '@site/src/context/AppContext';
import styles from './Navbar.module.css';

export default function ResetButton() {
  const { setPersonalization, setLanguage } = useContext(AppContext) as AppContextType;

  const resetDemo = () => {
    setPersonalization('default');
    setLanguage('en');
  };

  return (
    <div className="navbar__item">
      <a
        className={`navbar__link ${styles.navbarLink}`}
        onClick={resetDemo}
        style={{ cursor: 'pointer' }}>
        Reset Demo
      </a>
    </div>
  );
}
