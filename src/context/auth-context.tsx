/**
 * Context de autenticação
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { authService } from '@/lib/auth-service';
import { storage } from '@/lib/storage';
import axios from 'axios';
import { AuthContext as AuthContextType, User } from '@/types/auth';
import { analyticsService } from '@/lib/analytics';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAccountPendingDeletion, setIsAccountPendingDeletion] = useState(false);

  /**
   * Inicializa contexto ao carregar a página
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = storage.getItem('authToken');
      const storedUser = storage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          // Verificar se é um usuário lojista (tem storeId) ou administrador
          if (parsedUser.storeId || parsedUser.role === 'ADMIN') {
            setToken(storedToken);
            setUser(parsedUser);
            setIsAuthenticated(!!storedToken && parsedUser.emailVerified !== false);

            // Buscar dados atualizados do servidor sem disparar loop
            const userData = await authService.getCurrentUser();
            if (userData) {
              const updatedUser = {
                storeId: userData.storeId,
                tradeName: userData.tradeName,
                email: userData.email,
                role: userData.role,
                plan: userData.plan,
                profilePictureUrl: userData.profilePictureUrl,
                emailVerified: userData.emailVerified
              };
              setUser(updatedUser);
              setIsAuthenticated(!!storedToken && userData.emailVerified !== false);
              storage.setItem('user', JSON.stringify(updatedUser));
            }
          }
        } catch (error) {
          // Só logar erro se não for 401 ou 403 (falta de autenticação esperada se não logado)
          if (axios.isAxiosError(error)) {
            if (error.response?.status !== 401 && error.response?.status !== 403) {
              console.error('Erro ao carregar autenticação:', error);
            }
          } else {
            console.error('Erro ao carregar autenticação:', error);
          }
        }
      } else {
        // Tentar autenticação via cookie HttpOnly
        try {
          const userData = await authService.getCurrentUser();
          if (userData) {
            const userObj = {
              storeId: userData.storeId,
              tradeName: userData.tradeName,
              email: userData.email,
              role: userData.role,
              plan: userData.plan,
              profilePictureUrl: userData.profilePictureUrl,
              emailVerified: userData.emailVerified
            };
            setUser(userObj);
            setIsAuthenticated(userData.emailVerified !== false);
            storage.setItem('user', JSON.stringify(userObj));
          }
        } catch {
          // Não autenticado via cookie também
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Recarrega dados do usuário do servidor
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        const updatedUser = {
          storeId: userData.storeId,
          tradeName: userData.tradeName,
          email: userData.email,
          role: userData.role,
          plan: userData.plan,
          profilePictureUrl: userData.profilePictureUrl,
          emailVerified: userData.emailVerified
        };
        setUser(updatedUser);
        setIsAuthenticated(!!storage.getItem('authToken') && userData.emailVerified !== false);
        storage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  }, []);

  /**
   * Realiza login
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });

      const userData = {
        storeId: response.storeId,
        tradeName: response.tradeName,
        email: response.email,
        role: response.role,
        plan: response.plan,
        profilePictureUrl: response.profilePictureUrl,
        emailVerified: response.emailVerified,
      };

      if (response.token) {
        storage.setItem('authToken', response.token);
        setToken(response.token);
      }
      storage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(!!response.token && response.emailVerified !== false);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Realiza login com Google
   */
  const loginWithGoogle = useCallback(async (idToken: string) => {
    try {
      setIsLoading(true);
      const response = await authService.googleLogin(idToken);

      const userData = {
        storeId: response.storeId,
        tradeName: response.tradeName,
        email: response.email,
        role: response.role,
        plan: response.plan,
        isNewUser: response.isNewUser,
        emailVerified: response.emailVerified,
      };

      if (response.token) {
        storage.setItem('authToken', response.token);
        setToken(response.token);
      }
      storage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(!!response.token && response.emailVerified !== false);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Realiza registro
   */
  const register = useCallback(async (tradeName: string, taxId: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const taxIdType = taxId.length === 14 ? 'CNPJ' : 'CPF';
      const response = await authService.register({ tradeName, taxId, email, password, taxIdType });

      const userData = {
        storeId: response.storeId,
        tradeName: response.tradeName,
        email: response.email,
        role: response.role,
        plan: response.plan,
        isNewUser: false,
        emailVerified: response.emailVerified,
      };

      if (response.token) {
        storage.setItem('authToken', response.token);
        setToken(response.token);
      }
      storage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(!!response.token && response.emailVerified !== false);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Realiza logout
   */
  const logout = useCallback(() => {
    analyticsService.track('logout');
    authService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setIsAccountPendingDeletion(false);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated,
    isAccountPendingDeletion,
    login,
    loginWithGoogle,
    register,
    refreshUser,
    logout,
  }), [user, token, isLoading, isAuthenticated, isAccountPendingDeletion, login, loginWithGoogle, register, refreshUser, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para usar o contexto de autenticação
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
