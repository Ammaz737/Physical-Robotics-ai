import React from 'react';
import clsx from 'clsx'; // Assuming clsx is available

interface TerminalBlockProps {
  children: React.ReactNode;
  className?: string; // Optional: for custom styling
}

export default function TerminalBlock({ children, className }: TerminalBlockProps): JSX.Element {
  return (
    <div
      className={clsx('terminal-block-container', className)}
    >
      <div className="terminal-block-header">
        <span className="terminal-button close"></span>
        <span className="terminal-button minimize"></span>
        <span className="terminal-button maximize"></span>
        <span className="terminal-title">user@panaversity: ~</span>
      </div>
      <pre className="terminal-block-content">
        {children}
      </pre>
    </div>
  );
}
