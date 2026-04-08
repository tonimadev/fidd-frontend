/**
 * Serviço de autenticação para clientes (mobile)
 */

import { apiClient } from './api-client';
import { MobileAuthResponse, MobileRegisterRequest } from '@/types/mobile-auth';
import { LoginRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/types/auth';

const AUTH_BASE_URL = '/api/mobile/v1/auth';

export const mobileAuthService = {
  /**
   * Realiza login de um cliente
   */
  async login(data: LoginRequest): Promise<MobileAuthResponse> {
    const response = await apiClient.post<MobileAuthResponse>(
      `${AUTH_BASE_URL}/login`,
      data
    );
    return response.data;
  },

  /**
   * Realiza login de um cliente via Google
   */
  async googleLogin(idToken: string): Promise<MobileAuthResponse> {
    const response = await apiClient.post<MobileAuthResponse>(
      `${AUTH_BASE_URL}/google`,
      { idToken }
    );
    return response.data;
  },

  /**
   * Registra um novo cliente
   */
  async register(data: MobileRegisterRequest): Promise<MobileAuthResponse> {
    const response = await apiClient.post<MobileAuthResponse>(
      `${AUTH_BASE_URL}/register`,
      data
    );
    return response.data;
  },

  /**
   * Solicita recuperação de senha (compartilhado com web)
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await apiClient.post('/api/auth/forgot-password', data);
  },

  /**
   * Redefine a senha utilizando um token (compartilhado com web)
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post('/api/auth/reset-password', data);
  },

  /**
   * Faz logout do usuário cliente
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};
