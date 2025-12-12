import React, { useContext } from 'react';
import { AppContext, AppContextType } from '@site/src/context/AppContext';
import styles from './Navbar.module.css';

export default function PersonalizeButton() {
  const { personalization, setPersonalization } = useContext(AppContext) as AppContextType;

  const togglePersonalization = () => {
    setPersonalization(personalization === 'default' ? 'jetson-nano' : 'default');
  };

  return (
    <div className="navbar__item">
      <a
        className={`navbar__link ${styles.navbarLink}`}
        onClick={togglePersonalization}
        style={{ cursor: 'pointer' }}>
        {'⚙️ '}
        {personalization === 'jetson-nano' ? 'Default View' : 'Personalize (Jetson)'}
      </a>
    </div>
  );
}
