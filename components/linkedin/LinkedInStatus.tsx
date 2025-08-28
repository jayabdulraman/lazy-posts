"use client";

import React from "react";
import LinkedInAuthButton from "./LinkedInAuthButton";
import { useLinkedInStore } from '../../store/linkedinStore';

interface LinkedInUser {
  id?: string;
  name?: string;
  email?: string;
  profilePicture?: string;
}

interface LinkedInStatusProps {
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

function IconLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export default function LinkedInStatus({ onAuthChange, className = "" }: LinkedInStatusProps) {
  const [isChecking, setIsChecking] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  const { 
    isAuthenticated, 
    user, 
    getUserId, 
    getConnectionId, 
    setAuthenticated, 
    setUnauthenticated,
    setAuthorId,
    getAuthorId
  } = useLinkedInStore();

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
      
      const response = await fetch(`/api/linkedin/status?${queryParams.toString()}`);
      const data = await response.json();
      
      const authenticated = data.authenticated || false;
      console.log("LinkedIn authenticated", authenticated);
      console.log("LinkedIn data", data);
      
      if (authenticated) {
        setAuthenticated(user_id, data.connectionId || connectionId, data.user);
        
        // Fetch author ID if not already stored
        const currentAuthorId = getAuthorId();
        if (!currentAuthorId) {
          try {
            console.log("Fetching LinkedIn author ID...");
            const profileResponse = await fetch(`/api/linkedin/profile?userId=${user_id}`);
            const profileData = await profileResponse.json();
            
            if (profileData.success && profileData.authorId) {
              console.log("LinkedIn Author ID fetched:", profileData.authorId);
              console.log("LinkedIn Profile fetched:", profileData.profile);
              setAuthorId(profileData.authorId);
              
              // Update user data with LinkedIn profile info
              if (profileData.profile) {
                setAuthenticated(user_id, data.connectionId || connectionId, {
                  id: profileData.profile.id,
                  name: profileData.profile.name,
                  given_name: profileData.profile.given_name,
                  family_name: profileData.profile.family_name,
                  email: profileData.profile.email,
                  picture: profileData.profile.picture,
                  locale: profileData.profile.locale,
                });
              }
            } else {
              console.warn("Could not fetch LinkedIn author ID:", profileData.error);
            }
          } catch (profileError) {
            console.error("Error fetching LinkedIn profile:", profileError);
          }
        }
      } else {
        setUnauthenticated();
      }
      
      onAuthChange?.(authenticated);
      
      if (!authenticated && data.error) {
        setError(data.error);
      }
    } catch (error) {
      console.error('Failed to check LinkedIn auth status:', error);
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
        Checking LinkedIn connection...
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={`inline-flex items-center gap-2 text-sm text-green-600 ${className}`}>
        <IconCheck />
        <span>Connected to LinkedIn</span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <LinkedInAuthButton onAuthComplete={handleAuthComplete} />
    </div>
  );
}