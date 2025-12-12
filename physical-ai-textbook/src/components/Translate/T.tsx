import React, { useContext } from 'react';
import { AppContext, AppContextType } from '@site/src/context/AppContext';

interface TProps {
  en: string;
  ur: string;
}

export default function T({ en, ur }: TProps) {
  const { language } = useContext(AppContext) as AppContextType;

  if (language === 'ur') {
    return <>{ur}</>;
  }

  return <>{en}</>;
}
