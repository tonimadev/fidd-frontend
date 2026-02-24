/**
 * Configuração de cliente API
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types/auth';

/**
 * Cria instância do axios com configurações padrão
 */
export const createApiClient = (): AxiosInstance => {
  // Usar URLs relativas para funcionar com o proxy do Next.js
  const client = axios.create({
    baseURL: '/',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Interceptador de requisição para adicionar token
   */
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * Interceptador de resposta para tratamento de erros
   */
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
      if (error.response?.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

