import React, { useContext, ReactNode } from 'react';
import { AppContext, AppContextType } from '@site/src/context/AppContext';

interface HideProps {
  when: string;
  children: ReactNode;
}

export default function Hide({ when, children }: HideProps) {
  const { personalization } = useContext(AppContext) as AppContextType;

  if (personalization === when) {
    return null;
  }

  return <>{children}</>;
}
