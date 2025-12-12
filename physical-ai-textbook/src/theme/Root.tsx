import React from 'react';
import OriginalRoot from '@theme-original/Root';
import AiAssistant from '@site/src/components/Chat/AiAssistant';
import { AppProvider } from '../context/AppContext';
import PersonalizeButton from '@site/src/components/Navbar/PersonalizeButton';
import TranslateButton from '@site/src/components/Navbar/TranslateButton';
import ResetButton from '@site/src/components/Navbar/ResetButton';
import './Root.css';

import { LanguageProvider } from '../context/LanguageContext';

function Root(props) {
  return (
    <LanguageProvider>
      <AppProvider>
        <OriginalRoot {...props} />
        <AiAssistant />
      </AppProvider>
    </LanguageProvider>
  );
}

export default Root;
