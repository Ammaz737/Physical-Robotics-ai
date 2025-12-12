import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal'; // Assuming LoginModal is in the same directory
import { useHistory } from '@docusaurus/router'; // Import useHistory

interface AuthProtectedContentProps {
  children: React.ReactNode;
}

export default function AuthProtectedContent({ children }: AuthProtectedContentProps): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Potentially validate token with backend here if needed
      setIsLoggedIn(true);
    } else {
      setIsModalOpen(true); // Open modal if not logged in
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setIsModalOpen(false); // Close modal on successful auth
    // Optionally redirect if needed after successful login from here
    history.push(window.location.pathname); // Refresh current page to load content
  };

  // If not logged in, show a message and the modal
  if (!isLoggedIn) {
    return (
      <>
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--ifm-font-color-base)' }}>
          <p>Please login or sign up to view this content.</p>
          <button className="button button--primary" onClick={() => setIsModalOpen(true)}>Login / Sign Up</button>
        </div>
        <LoginModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            // If user closes modal without logging in, redirect away from protected content
            if (!isLoggedIn) {
                history.push('/'); // Redirect to homepage
            }
          }}
          onLoginSuccess={handleAuthSuccess}
          onSignupSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // If logged in, render the children (protected content)
  return <>{children}</>;
}
