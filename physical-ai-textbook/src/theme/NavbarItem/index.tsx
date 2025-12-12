// physical-ai-textbook/src/theme/NavbarItem/index.tsx
import React from 'react';
import NavbarItem from '@theme-original/NavbarItem';
import TranslateToggle from '@site/src/components/NavbarItems/TranslateToggle';

export default function NavbarItemWrapper(props) {
  // 1. Intercept custom components
  if (props.type === 'custom-translateButton') {
    return <TranslateToggle {...props} />;
  }

  // 2. CRITICAL FIX: Default undefined types to 'default'
  // This prevents the "No NavbarItem component found for type undefined" crash
  return <NavbarItem {...props} type={props.type ?? 'default'} />;
}