/**
 * Context de autenticação
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/lib/auth-service';
import { AuthContext as AuthContextType, User } from '@/types/auth';
import { AxiosError } from 'axios';

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
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Erro ao carregar autenticação:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Realiza login
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });

      // Armazena token e dados do usuário
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify({
        storeId: response.storeId,
        tradeName: response.tradeName,
        email: response.email,
        role: response.role,
      }));

      setToken(response.token);
      setUser({
        storeId: response.storeId,
        tradeName: response.tradeName,
        email: response.email,
        role: response.role,
      });
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Realiza registro
   */
  const register = async (tradeName: string, taxId: string, email: string, password: string) => {
    try {
      setIsLoading(true);

      // Detectar se é CNPJ (14 dígitos) ou CPF (11 dígitos)
      const taxIdType = taxId.length === 14 ? 'CNPJ' : 'CPF';

      const response = await authService.register({ tradeName, taxId, email, password, taxIdType });

      // ...existing code...
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify({
        storeId: response.storeId,
        tradeName: response.tradeName,
        email: response.email,
        role: response.role,
      }));

      setToken(response.token);
      setUser({
        storeId: response.storeId,
        tradeName: response.tradeName,
        email: response.email,
        role: response.role,
      });
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Realiza logout
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setIsAccountPendingDeletion(false);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAccountPendingDeletion,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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

