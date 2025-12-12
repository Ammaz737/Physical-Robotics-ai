import React, { useContext, ReactNode } from 'react';
import { AppContext, AppContextType } from '@site/src/context/AppContext';

interface ShowProps {
  when: string;
  children: ReactNode;
}

export default function Show({ when, children }: ShowProps) {
  const { personalization } = useContext(AppContext) as AppContextType;

  if (personalization === when) {
    return <>{children}</>;
  }

  return null;
}
