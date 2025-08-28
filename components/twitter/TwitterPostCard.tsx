"use client";

import React from "react";

interface TwitterUser {
  id?: string;
  name?: string;
  username?: string;
  profile_image_url?: string;
}

interface TwitterPostResult {
  type: 'twitter-post-result' | 'twitter-post-preview' | 'twitter-post-success';
  toolCallId?: string;
  tweetId?: string;
  tweetUrl?: string;
  content: string;
  createdAt?: string;
  timestamp?: number;
  user?: TwitterUser;
  success?: boolean;
  posted: boolean;
  userId?: string;
  tweetData?: any;
  sources?: string[];
}

interface TwitterPostCardProps {
  postData: TwitterPostResult;
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

function IconTwitter() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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

export default function TwitterPostCard({ postData, onPost }: TwitterPostCardProps) {
  const [isPosting, setIsPosting] = React.useState(false);
  const [postError, setPostError] = React.useState<string | null>(null);
  
  console.log("postData:", postData);
  const handlePost = async () => {
    if (!onPost || !postData.userId) return;
    
    setIsPosting(true);
    setPostError(null);
    
    try {
      await onPost(postData.content, postData.userId);
    } catch (error) {
      setPostError(error instanceof Error ? error.message : 'Failed to post tweet');
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
    if (postData.user?.username) return postData.user.username;
    return 'You';
  };

  const getUserHandle = () => {
    if (postData.user?.username) return `@${postData.user.username}`;
    return '@you';
  };

  const getProfileImage = () => {
    return postData.user?.profile_image_url || '/api/placeholder/40/40';
  };

  const isPreview = !postData.posted;
  const isPosted = postData.posted;
  
  return (
    <div className="my-4 max-w-xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header with status indicator */}
      <div className="mb-3 flex items-center justify-between">
        {isPreview ? (
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
            <IconTwitter />
            <span>Preview Tweet</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <IconCheck />
            <span>Successfully posted to X</span>
          </div>
        )}
        <div className="text-gray-400">
          <IconTwitter />
        </div>
      </div>
      
      {/* Twitter Post Content */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        {/* User info */}
        <div className="mb-3 flex items-center gap-3">
          <img
            src={getProfileImage()}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGMzRGNEYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTggMzJDOCAyNi40NzcxIDEyLjQ3NzEgMjIgMTggMjJIMjJDMjcuNTIyOSAyMiAzMiAyNi40NzcxIDMyIDMyVjMySDhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
            }}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">{getUserDisplayName()}</span>
            </div>
            <span className="text-sm text-gray-500">{getUserHandle()}</span>
          </div>
        </div>
        
        {/* Tweet content */}
        <div className="mb-3">
          <p className="whitespace-pre-wrap text-gray-900">
            {postData.content}
          </p>
        </div>
        
        
        {/* Timestamp */}
        <div className="text-sm text-gray-500">
          {formatDate(postData.createdAt, postData.timestamp)}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="mt-3 flex items-center justify-between">
        {isPosted && postData.tweetId && (
          <div className="text-xs text-gray-500">
            Tweet ID: {postData.tweetId}
          </div>
        )}
        
        {isPreview ? (
          <div className="flex flex-col items-end gap-2">
            {postError && (
              <div className="text-xs text-red-600">{postError}</div>
            )}
            <button
              onClick={handlePost}
              disabled={isPosting || !onPost}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isPosting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Posting...
                </>
              ) : (
                <>
                  <IconTwitter />
                  Post to Twitter
                </>
              )}
            </button>
          </div>
        ) : (
          postData.tweetUrl && (
            <a
              href={postData.tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              View on X
              <IconExternalLink />
            </a>
          )
        )}
      </div>
    </div>
  );
}