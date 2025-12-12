import React, { createContext, useState, ReactNode } from 'react';

export type PersonalizationType = 'default' | 'jetson-nano';
export type LanguageType = 'en' | 'ur';

export interface AppContextType {
  personalization: PersonalizationType;
  setPersonalization: (personalization: PersonalizationType) => void;
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [personalization, setPersonalization] = useState<PersonalizationType>('default');
  const [language, setLanguage] = useState<LanguageType>('en');

  const value = {
    personalization,
    setPersonalization,
    language,
    setLanguage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
