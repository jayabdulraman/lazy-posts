import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TwitterUser {
  id?: string;
  name?: string;
  username?: string;
  profile_image_url?: string;
}

interface TwitterAuthState {
  // Authentication state
  isAuthenticated: boolean;
  userId: string | null;
  connectionId: string | null;
  user: TwitterUser | null;
  
  // Actions
  setAuthenticated: (userId: string, connectionId?: string, user?: TwitterUser) => void;
  setUnauthenticated: () => void;
  getUserId: () => string;
  getConnectionId: () => string | null;
}

export const useTwitterStore = create<TwitterAuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      userId: null,
      connectionId: null,
      user: null,

      // Actions
      setAuthenticated: (userId: string, connectionId?: string, user?: TwitterUser) => {
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
    }),
    {
      name: 'twitter-auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        connectionId: state.connectionId,
        user: state.user,
      }),
    }
  )
);