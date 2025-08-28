import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface LinkedInAuthState {
  // Authentication state
  isAuthenticated: boolean;
  userId: string | null;
  connectionId: string | null;
  user: LinkedInUser | null;
  authorId: string | null; // LinkedIn author ID for posting
  
  // Actions
  setAuthenticated: (userId: string, connectionId?: string, user?: LinkedInUser) => void;
  setUnauthenticated: () => void;
  setAuthorId: (authorId: string) => void;
  getUserId: () => string;
  getConnectionId: () => string | null;
  getAuthorId: () => string | null;
}

export const useLinkedInStore = create<LinkedInAuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      userId: null,
      connectionId: null,
      user: null,
      authorId: null,

      // Actions
      setAuthenticated: (userId: string, connectionId?: string, user?: LinkedInUser) => {
        set({
          isAuthenticated: true,
          userId,
          connectionId: connectionId || null,
          user: user || null,
        });
      },

      setUnauthenticated: () => {
        set({
          isAuthenticated: false,
          userId: null,
          connectionId: null,
          user: null,
          authorId: null,
        });
      },

      setAuthorId: (authorId: string) => {
        set({
          authorId,
        });
      },

      getUserId: () => {
        const state = get();
        if (state.userId) {
          return state.userId;
        }
        
        // Generate a new UUID if no userId exists
        const newUserId = typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        set({ userId: newUserId });
        return newUserId;
      },

      getConnectionId: () => {
        const state = get();
        return state.connectionId;
      },

      getAuthorId: () => {
        const state = get();
        return state.authorId;
      },
    }),
    {
      name: 'linkedin-auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        connectionId: state.connectionId,
        user: state.user,
        authorId: state.authorId,
      }),
    }
  )
);