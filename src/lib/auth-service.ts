/**
 * Serviço de autenticação
 */

import { apiClient } from './api-client';
import { AuthResponse, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/types/auth';

const AUTH_BASE_URL = '/api/web/v1/auth';

export const authService = {
  /**
   * Realiza login de uma loja
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${AUTH_BASE_URL}/login`,
      data
    );
    return response.data;
  },

  /**
   * Realiza login de uma loja via Google
   */
  async googleLogin(idToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${AUTH_BASE_URL}/google`,
      { idToken }
    );
    return response.data;
  },

  /**
   * Solicita recuperação de senha
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await apiClient.post('/api/auth/forgot-password', data);
  },

  /**
   * Redefine a senha utilizando um token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post('/api/auth/reset-password', data);
  },

  /**
   * Registra uma nova loja
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${AUTH_BASE_URL}/register`,
      data
    );
    return response.data;
  },

  /**
   * Obtém dados do usuário atual
   */
  async getCurrentUser() {
    const response = await apiClient.get(`${AUTH_BASE_URL}/me`);
    return response.data;
  },

  /**
   * Faz logout do usuário
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

