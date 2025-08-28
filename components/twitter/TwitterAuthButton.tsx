"use client";

import React from "react";
import { useTwitterStore } from '../../store/twitterStore';

interface TwitterAuthButtonProps {
  onAuthComplete?: () => void;
  className?: string;
}

function IconTwitter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15,3 21,3 21,9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export default function TwitterAuthButton({ onAuthComplete, className = "" }: TwitterAuthButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { getUserId, setAuthenticated, setUnauthenticated } = useTwitterStore();

  const handleAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get consistent user ID from store
      const user_id = getUserId();
      const response = await fetch('/api/twitter/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user_id
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get authentication URL');
      }

      if (data.authUrl) {
        // Store connection ID for status checks
        const connectionId = data.connectionId;
        
        // Open Twitter authentication in a new window
        const authWindow = window.open(
          data.authUrl,
          'twitter-auth',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        if (!authWindow) {
          throw new Error('Please allow popups to authenticate with Twitter');
        }

        // Listen for authentication completion
        const checkClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkClosed);
            setIsLoading(false);
            // Check if authentication was successful
            checkAuthStatus(connectionId);
          }
        }, 1000);
        
        // Also poll for connection status while window is open
        const statusCheckInterval = setInterval(async () => {
          if (authWindow.closed) {
            clearInterval(statusCheckInterval);
            return;
          }
          
          try {
            const statusResponse = await fetch(`/api/twitter/status?connectionId=${connectionId}`);
            const statusData = await statusResponse.json();
            
            if (statusData.authenticated) {
              clearInterval(statusCheckInterval);
              clearInterval(checkClosed);
              authWindow.close();
              setIsLoading(false);
              
              // Save authentication state to store
              setAuthenticated(user_id, connectionId, statusData.user);
              onAuthComplete?.();
            }
          } catch (error) {
            console.error('Status check error:', error);
          }
        }, 2000);

        // Also listen for messages from the auth window
        const messageListener = (event: MessageEvent) => {
          if (event.origin === window.location.origin && event.data.type === 'twitter-auth-success') {
            clearInterval(checkClosed);
            authWindow.close();
            window.removeEventListener('message', messageListener);
            setIsLoading(false);
            onAuthComplete?.();
          }
        };
        window.addEventListener('message', messageListener);
        
      } else {
        throw new Error('No authentication URL received');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
      setIsLoading(false);
    }
  };

  const checkAuthStatus = async (connectionId?: string) => {
    try {
      const user_id = getUserId();
      const queryParams = new URLSearchParams();
      
      if (connectionId) {
        queryParams.append('connectionId', connectionId);
      }
      
      queryParams.append('userId', user_id);
      
      const response = await fetch(`/api/twitter/status?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.authenticated) {
        // Save authentication state to store
        setAuthenticated(user_id, connectionId, data.user);
        onAuthComplete?.();
      } else {
        setUnauthenticated();
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setUnauthenticated();
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleAuth}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <IconTwitter />
        {isLoading ? 'Connecting...' : 'Connect Twitter'}
        <IconExternalLink />
      </button>
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}