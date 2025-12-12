import React, { useState } from 'react';
import Layout from '@theme/Layout';
import LoginModal from '@site/src/components/Auth/LoginModal';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from '@docusaurus/router'; // Import useHistory

export default function LoginPage(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal is open by default on this page

  const handleAuthSuccess = (token: string) => {
    // Optionally display a success message or redirect after login/signup
    console.log("Authentication successful, token:", token);
    setIsModalOpen(false); // Close modal on success
    history.push('/'); // Redirect to homepage or dashboard
  };

  return (
    <Layout
      title={`Login / Signup - ${siteConfig.title}`}
      description="Login or signup to access personalized content and features.">
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <LoginModal
          isOpen={isModalOpen}
          onClose={() => history.push('/')} // Redirect to homepage if modal is closed
          onLoginSuccess={handleAuthSuccess}
          onSignupSuccess={handleAuthSuccess}
        />
      </main>
    </Layout>
  );
}
