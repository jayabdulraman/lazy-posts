"use client";

import React from "react";
import { useLinkedInStore } from '../../store/linkedinStore';

interface LinkedInAuthButtonProps {
  onAuthComplete?: () => void;
  className?: string;
}

function IconLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
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

export default function LinkedInAuthButton({ onAuthComplete, className = "" }: LinkedInAuthButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { getUserId, setAuthenticated, setUnauthenticated } = useLinkedInStore();

  const handleAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get consistent user ID from store
      const user_id = getUserId();
      const response = await fetch('/api/linkedin/auth', {
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
        
        // Open LinkedIn authentication in a new window
        const authWindow = window.open(
          data.authUrl,
          'linkedin-auth',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        if (!authWindow) {
          throw new Error('Please allow popups to authenticate with LinkedIn');
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
            const statusResponse = await fetch(`/api/linkedin/status?connectionId=${connectionId}`);
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
          if (event.origin === window.location.origin && event.data.type === 'linkedin-auth-success') {
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
      
      const response = await fetch(`/api/linkedin/status?${queryParams.toString()}`);
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
        className={`inline-flex items-center gap-2 rounded-lg bg-[#0066cc] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0052a3] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <IconLinkedIn />
        {isLoading ? 'Connecting...' : 'Connect LinkedIn'}
        <IconExternalLink />
      </button>
      
      {error && (
       <div className="text-xm text-red-600 px-3 py-2">
          {error}
        </div>
      )}
    </div>
  );
}