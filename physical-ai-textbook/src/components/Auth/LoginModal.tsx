import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './LoginModal.module.css'; // Will create this CSS module

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (token: string) => void;
  onSignupSuccess?: (token: string) => void;
}

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-backend.com' // TODO: Replace with actual production URL
  : 'http://localhost:8000'; // Default to localhost for development

export default function LoginModal({ isOpen, onClose, onLoginSuccess, onSignupSuccess }: LoginModalProps): JSX.Element | null {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codingBackground, setCodingBackground] = useState('');
  const [hardwareType, setHardwareType] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isLoginMode ? `${API_BASE_URL}/token` : `${API_BASE_URL}/signup`;
    const method = isLoginMode ? 'POST' : 'POST';
    const headers = {
      'Content-Type': 'application/json',
    };
    let body: BodyInit;

    if (isLoginMode) {
      const form = new URLSearchParams();
      form.append('username', email);
      form.append('password', password);
      body = form.toString();
      (headers as any)['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      body = JSON.stringify({
        email,
        password,
        coding_background: codingBackground,
        hardware_type: hardwareType,
      });
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers,
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (isLoginMode) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('token_type', data.token_type);
        onLoginSuccess?.(data.access_token);
      } else {
        // After signup, automatically login or provide a message
        // For simplicity, we'll just log in the user after signup
        const loginForm = new URLSearchParams();
        loginForm.append('username', email);
        loginForm.append('password', password);
        const loginResponse = await fetch(`${API_BASE_URL}/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: loginForm.toString(),
        });
        const loginData = await loginResponse.json();
        localStorage.setItem('access_token', loginData.access_token);
        localStorage.setItem('token_type', loginData.token_type);
        onSignupSuccess?.(loginData.access_token);
      }
      onClose(); // Close modal on success
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={clsx(styles.modalOverlay)}>
      <div className={clsx(styles.modalContent)}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>{isLoginMode ? 'Login' : 'Sign Up'}</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleAuth}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLoginMode && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="codingBackground">Coding Background:</label>
                <select
                  id="codingBackground"
                  value={codingBackground}
                  onChange={(e) => setCodingBackground(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Python">Python</option>
                  <option value="C++">C++</option>
                  <option value="None">None</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="hardwareType">Hardware:</label>
                <select
                  id="hardwareType"
                  value={hardwareType}
                  onChange={(e) => setHardwareType(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="RTX GPU">RTX GPU</option>
                  <option value="Mac">Mac</option>
                  <option value="Jetson">Jetson</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </>
          )}
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Sign Up')}
          </button>
        </form>
        <p className={styles.toggleMode}>
          {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
          <span onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}
