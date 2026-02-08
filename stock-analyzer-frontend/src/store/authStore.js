import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      
      login: (userData, accessToken, refreshToken) => {
        set({ 
          user: userData, 
          token: accessToken,
          refreshToken: refreshToken,
          isAuthenticated: true 
        });
        // Also store refresh token separately for axios interceptor
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          token: null,
          refreshToken: null,
          isAuthenticated: false 
        });
        localStorage.removeItem('refreshToken');
      },
      
      updateUser: (userData) => set((state) => ({ 
        user: { ...state.user, ...userData } 
      })),
      
      updateTokens: (accessToken, refreshToken) => {
        set({ token: accessToken, refreshToken });
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

