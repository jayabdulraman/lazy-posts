"use client";

import React from "react";
import TwitterAuthButton from "./TwitterAuthButton";
import { useTwitterStore } from '../../store/twitterStore';

interface TwitterUser {
  id?: string;
  name?: string;
  username?: string;
  profile_image_url?: string;
}

interface TwitterStatusProps {
  onAuthChange?: (authenticated: boolean) => void;
  className?: string;
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}

function IconTwitter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export default function TwitterStatus({ onAuthChange, className = "" }: TwitterStatusProps) {
  const [isChecking, setIsChecking] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  const { 
    isAuthenticated, 
    user, 
    getUserId, 
    getConnectionId, 
    setAuthenticated, 
    setUnauthenticated 
  } = useTwitterStore();

  const checkAuthStatus = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      const user_id = getUserId();
      const connectionId = getConnectionId();
      
      const queryParams = new URLSearchParams();
      queryParams.append('userId', user_id);
      
      if (connectionId) {
        queryParams.append('connectionId', connectionId);
      }
      
      const response = await fetch(`/api/twitter/status?${queryParams.toString()}`);
      const data = await response.json();
      
      const authenticated = data.authenticated || false;
      console.log("authenticated", authenticated);
      console.log("data", data);
      
      if (authenticated) {
        setAuthenticated(user_id, data.connectionId || connectionId, data.user);
      } else {
        setUnauthenticated();
      }
      
      onAuthChange?.(authenticated);
      
      if (!authenticated && data.error) {
        setError(data.error);
      }
    } catch (error) {
      console.error('Failed to check Twitter auth status:', error);
      setUnauthenticated();
      setError('Failed to check authentication status');
      onAuthChange?.(false);
    } finally {
      setIsChecking(false);
    }
  };

  React.useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleAuthComplete = () => {
    // Recheck authentication status after successful auth
    checkAuthStatus();
  };

  if (isChecking && isAuthenticated === null) {
    return (
      <div className={`inline-flex items-center gap-2 text-sm text-gray-500 ${className}`}>
        <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full"></div>
        Checking Twitter connection...
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={`inline-flex items-center gap-2 text-sm text-green-600 ${className}`}>
        <IconCheck />
        <span>Connected to Twitter</span>
        {user?.username && (
          <span className="text-gray-500">as @{user.username}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      
      <TwitterAuthButton onAuthComplete={handleAuthComplete} />
    </div>
  );
}