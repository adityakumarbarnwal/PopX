/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ScreenType, AuthState } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  currentScreen: ScreenType;
  history: ScreenType[];
  signup: (userData: User, passwordStr: string) => Promise<boolean>;
  login: (email: string, passwordStr: string) => Promise<boolean>;
  logout: () => void;
  navigateTo: (screen: ScreenType) => void;
  goBack: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [history, setHistory] = useState<ScreenType[]>(['welcome']);

  // Load initial session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Attempt to load from localStorage first for immediate responsiveness
        const storedUser = localStorage.getItem('popx_current_user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setAuthState(prev => ({
              ...prev,
              user: parsed,
              isAuthenticated: true,
              isLoading: false,
            }));
            setCurrentScreen('profile');
            setHistory(['welcome', 'profile']);
            return;
          } catch {
            localStorage.removeItem('popx_current_user');
          }
        }

        // Alternatively check server health or session if desired
        const response = await fetch('/api/me');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setAuthState({
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            setCurrentScreen('profile');
            setHistory(['welcome', 'profile']);
            return;
          }
        }
      } catch (err) {
        console.warn('API /api/me check fallback to local storage:', err);
      } finally {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const navigateTo = (screen: ScreenType) => {
    setHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // remove current
      const prevScreen = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('welcome');
    }
  };

  const signup = async (userData: User, passwordStr: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: userData.fullName,
          phone: userData.phone,
          email: userData.email,
          password: passwordStr,
          companyName: userData.companyName,
          isAgency: userData.isAgency,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create account');
      }

      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      localStorage.setItem(
        'popx_current_user',
        JSON.stringify(result.user)
      );

      navigateTo('profile');

      return true;
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to create account',
      }));

      return false;
    }
  };

  const login = async (
    email: string,
    passwordStr: string
  ): Promise<boolean> => {
    setAuthState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: passwordStr,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || 'Invalid credentials'
        );
      }

      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      localStorage.setItem(
        'popx_current_user',
        JSON.stringify(result.user)
      );

      navigateTo('profile');

      return true;
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error:
          err.message ||
          'Invalid email address or password',
      }));

      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('popx_current_user');
    // Call server endpoint logout as fire-and-forget
    fetch('/api/logout', { method: 'POST' }).catch(() => {});
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    setHistory(['welcome']);
    setCurrentScreen('welcome');
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        currentScreen,
        history,
        signup,
        login,
        logout,
        navigateTo,
        goBack,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
