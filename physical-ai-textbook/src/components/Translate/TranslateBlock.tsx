import React from 'react';
import { useLanguage } from '@site/src/context/LanguageContext';

interface TranslateBlockProps {
  en: string;
  ur: string;
}

export default function TranslateBlock({ en, ur }: TranslateBlockProps) {
  const { isUrdu } = useLanguage();

  if (isUrdu) {
    return <>{ur}</>;
  }

  return <>{en}</>;
}
