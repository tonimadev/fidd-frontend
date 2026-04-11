/**
 * Context de autenticação
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { authService } from '@/lib/auth-service';
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
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          // Verificar se é um usuário lojista (tem storeId)
          if (parsedUser.storeId) {
            setToken(storedToken);
            setUser(parsedUser);
            setIsAuthenticated(true);

            // Buscar dados atualizados do servidor sem disparar loop
            const userData = await authService.getCurrentUser();
            if (userData) {
              const updatedUser = {
                storeId: userData.storeId,
                tradeName: userData.tradeName,
                email: userData.email,
                role: userData.role,
                plan: userData.plan
              };
              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
          }
        } catch (error) {
          console.error('Erro ao carregar autenticação:', error);
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
          plan: userData.plan
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
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
