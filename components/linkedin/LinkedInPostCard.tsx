"use client";

import React from "react";

interface LinkedInUser {
  id?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  picture?: string;
  locale?: {
    country: string;
    language: string;
  };
}

interface LinkedInPostResult {
  type: 'linkedin-post-result' | 'linkedin-post-preview' | 'linkedin-post-success';
  toolCallId?: string;
  postId?: string;
  postUrl?: string;
  content: string;
  createdAt?: string;
  timestamp?: number;
  user?: LinkedInUser;
  success?: boolean;
  posted: boolean;
  userId?: string;
  postData?: any;
  sources?: string[];
}

interface LinkedInPostCardProps {
  postData: LinkedInPostResult;
  onPost?: (content: string, userId: string) => Promise<void>;
}

function IconExternalLink() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15,3 21,3 21,9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}

export default function LinkedInPostCard({ postData, onPost }: LinkedInPostCardProps) {
  const [isPosting, setIsPosting] = React.useState(false);
  const [postError, setPostError] = React.useState<string | null>(null);
  
  // Debug: Log the user data being passed to this component
  React.useEffect(() => {
    console.log('LinkedInPostCard - postData.user:', postData.user);
  }, [postData.user]);
  
  
  const handlePost = async () => {
    if (!onPost || !postData.userId) return;
    
    setIsPosting(true);
    setPostError(null);
    
    try {
      await onPost(postData.content, postData.userId);
    } catch (error) {
      setPostError(error instanceof Error ? error.message : 'Failed to post to LinkedIn');
    } finally {
      setIsPosting(false);
    }
  };

  const formatDate = (dateString?: string, timestamp?: number) => {
    try {
      const date = dateString ? new Date(dateString) : (timestamp ? new Date(timestamp) : new Date());
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Just now';
    }
  };

  const getUserDisplayName = () => {
    if (postData.user?.name) return postData.user.name;
    return 'Your Professional Profile';
  };

  const getProfileImage = () => {
    return postData.user?.picture || '/api/placeholder/40/40';
  };

  const isPreview = !postData.posted;
  const isPosted = postData.posted;
  
  return (
    <div className="my-4 max-w-xl rounded-2xl border border-blue-200 bg-white p-4 shadow-sm">
      {/* Header with status indicator */}
      <div className="mb-3 flex items-center justify-between">
        {isPreview ? (
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
            <IconLinkedIn />
            <span>Preview LinkedIn Post</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <IconCheck />
            <span>Successfully posted to LinkedIn</span>
          </div>
        )}
        <div className="text-[#0066cc]">
          <IconLinkedIn />
        </div>
      </div>
      
      {/* LinkedIn Post Content */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        {/* User info */}
        <div className="mb-3 flex items-start gap-3">
          <img
            src={getProfileImage()}
            alt="Profile"
            className="h-12 w-12 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiMwMDY2Q0MiLz4KPGNpcmNsZSBjeD0iMjQiIGN5PSIxOCIgcj0iNiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEwIDM4QzEwIDMyLjQ3NzEgMTQuNDc3MSAyOCAyMCAyOEgyOEMzMy41MjI5IDI4IDM4IDMyLjQ3NzEgMzggMzhWMzhIMTBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
            }}
          />
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">{getUserDisplayName()}</span>
            </div>
            <span className="text-sm text-gray-600">
              {postData.user?.email || 'Professional Network'}
            </span>
          </div>
        </div>
        
        {/* Post content */}
        <div className="mb-4">
          <div className="whitespace-pre-wrap text-gray-900 font-medium leading-relaxed" style={{ lineHeight: '1.6' }}>
            {postData.content}
          </div>
        </div>
        
        {/* Timestamp */}
        <div className="text-sm text-gray-500">
          {formatDate(postData.createdAt, postData.timestamp)}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex-1">
          {/* Empty space for balance */}
        </div>
        
        {isPreview ? (
          <div className="flex flex-col items-end gap-2">
            {postError && (
              <div className="text-xs text-red-600">{postError}</div>
            )}
            <button
              onClick={handlePost}
              disabled={isPosting || !onPost}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0066cc] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0052a3] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isPosting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <IconLinkedIn />
                  Publish to LinkedIn
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {postData.postId && (
              <div className="text-xs text-gray-500">
                Post ID: {postData.postId}
              </div>
            )}
            <a
              href={postData.postUrl || "https://www.linkedin.com/feed/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0066cc] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0052a3]"
            >
              View on LinkedIn
              <IconExternalLink />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}