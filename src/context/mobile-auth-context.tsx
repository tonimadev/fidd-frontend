/**
 * Context de autenticação para o cliente (mobile)
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { mobileAuthService } from '@/lib/mobile-auth-service';
import { MobileUser, MobileRegisterRequest } from '@/types/mobile-auth';
import { analyticsService } from '@/lib/analytics';

interface MobileAuthContextType {
  user: MobileUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (data: MobileRegisterRequest) => Promise<void>;
  logout: () => void;
}

const MobileAuthContext = createContext<MobileAuthContextType | undefined>(undefined);

export const MobileAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MobileUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Verificar se é um usuário cliente (tem userId em vez de storeId)
          if (parsedUser.userId && parsedUser.role === 'ROLE_CUSTOMER') {
            setToken(storedToken);
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Erro ao carregar autenticação mobile:', error);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await mobileAuthService.login({ email, password });

      const userData: MobileUser = {
        userId: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
        isNewUser: false,
        linkedPunchesCount: response.linkedPunchesCount,
      };

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(response.token);
      setUser(userData);
      setIsAuthenticated(true);
      analyticsService.track('login', { method: 'email' });
    } catch (error) {
      setIsAuthenticated(false);
      analyticsService.track('login_failed', { method: 'email', error_type: 'bad_credentials' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    try {
      setIsLoading(true);
      const response = await mobileAuthService.googleLogin(idToken);

      const userData: MobileUser = {
        userId: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
        isNewUser: response.isNewUser,
        linkedPunchesCount: response.linkedPunchesCount,
      };

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(response.token);
      setUser(userData);
      setIsAuthenticated(true);
      analyticsService.track('login', { method: 'google' });
    } catch (error) {
      setIsAuthenticated(false);
      analyticsService.track('login_failed', { method: 'google' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: MobileRegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await mobileAuthService.register(data);

      const userData: MobileUser = {
        userId: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
        isNewUser: false,
        linkedPunchesCount: response.linkedPunchesCount,
      };

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(response.token);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    analyticsService.track('logout');
    mobileAuthService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    loginWithGoogle,
    register,
    logout,
  }), [user, token, isLoading, isAuthenticated, login, loginWithGoogle, register, logout]);

  return (
    <MobileAuthContext.Provider value={contextValue}>
      {children}
    </MobileAuthContext.Provider>
  );
};

export const useMobileAuth = (): MobileAuthContextType => {
  const context = useContext(MobileAuthContext);
  if (!context) {
    throw new Error('useMobileAuth deve ser usado dentro de MobileAuthProvider');
  }
  return context;
};
