import React from 'react';
import clsx from 'clsx'; // Assuming clsx is available from package.json

interface HardwareBadgeProps {
  children: React.ReactNode;
  type?: 'gpu' | 'edge'; // Optional: for different styling based on type
  className?: string; // Optional: for custom styling
}

export default function HardwareBadge({ children, type, className }: HardwareBadgeProps): JSX.Element {
  return (
    <span
      className={clsx(
        'badge', // Docusaurus Infima base badge style
        'hardware-badge', // Custom class for specific styling
        className
      )}
      style={{
        marginRight: '0.5rem',
        padding: '0.25em 0.6em',
        borderRadius: '0.5em',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: '0.75em',
        backgroundColor: type === 'gpu' ? 'var(--ifm-color-danger)' : (type === 'edge' ? 'var(--ifm-color-info)' : 'var(--ifm-color-primary)'),
        color: 'white',
      }}
    >
      {children}
    </span>
  );
}
