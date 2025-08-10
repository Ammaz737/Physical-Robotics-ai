'use client';

import { useEffect, useState } from 'react';
import { Download, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface PWARegistrationProps {
  children: React.ReactNode;
}

export default function PWARegistration({ children }: PWARegistrationProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Check if PWA is already installed
    const checkPWAInstallation = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true) {
        setIsPWAInstalled(true);
      }
    };

    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Handle appinstalled event
    const handleAppInstalled = () => {
      setIsPWAInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered:', registration);

          // Listen for service worker messages
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SYNC_STARTED') {
              setSyncStatus('syncing');
            } else if (event.data && event.data.type === 'SYNC_COMPLETE') {
              setSyncStatus('success');
              setTimeout(() => setSyncStatus('idle'), 3000);
            } else if (event.data && event.data.type === 'SYNC_ERROR') {
              setSyncStatus('error');
              setTimeout(() => setSyncStatus('idle'), 3000);
            }
          });

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  if (confirm('A new version is available. Would you like to update?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    // Initialize
    checkPWAInstallation();
    updateOnlineStatus();
    registerServiceWorker();

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installed successfully');
      } else {
        console.log('PWA installation declined');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      {children}
      
      {/* Connection Status Bar */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 text-center z-50">
          <div className="flex items-center justify-center space-x-2">
            <WifiOff size={16} />
            <span>You are offline. Some features may be limited.</span>
          </div>
        </div>
      )}

      {/* Sync Status Indicator */}
      {syncStatus !== 'idle' && (
        <div className="fixed top-0 right-4 mt-4 z-50">
          <div className={`px-4 py-2 rounded-md shadow-lg ${
            syncStatus === 'syncing' ? 'bg-blue-500 text-white' :
            syncStatus === 'success' ? 'bg-green-500 text-white' :
            'bg-red-500 text-white'
          }`}>
            <div className="flex items-center space-x-2">
              {syncStatus === 'syncing' && <RefreshCw size={16} className="animate-spin" />}
              <span>
                {syncStatus === 'syncing' && 'Syncing offline data...'}
                {syncStatus === 'success' && 'Data synced successfully!'}
                {syncStatus === 'error' && 'Sync failed. Please try again.'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Prompt */}
      {showInstallPrompt && !isPWAInstalled && (
        <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download size={24} className="text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Install POS System</h3>
                <p className="text-sm text-gray-600">
                  Install this app on your device for quick access and offline use
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleInstallPWA}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Available Prompt */}
      {!isPWAInstalled && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            title="Check for updates"
          >
            <RefreshCw size={16} />
            <span className="text-sm">Update</span>
          </button>
        </div>
      )}
    </>
  );
}
