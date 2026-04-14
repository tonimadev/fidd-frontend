/**
 * Configuração de cliente API
 */

import { storage } from './storage';
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types/auth';

/**
 * Cria instância do axios com configurações padrão
 */
export const createApiClient = (): AxiosInstance => {
  // Usar URLs relativas para funcionar com o proxy do Next.js
  const client = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Interceptador de requisição para adicionar token e idioma
   */
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Adicionar token de autenticação
      const token = storage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Adicionar header Accept-Language para i18n
      // Prioridade: localStorage > navegador > padrão pt-BR
      const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
      const browserLanguage = typeof window !== 'undefined' ? window.navigator.language : null;
      
      let language = savedLanguage || browserLanguage || 'pt-BR';
      
      // Normalizar para pt-BR ou en-US conforme solicitado pelo backend
      if (language.startsWith('en')) {
        language = 'en-US';
      } else {
        language = 'pt-BR';
      }

      config.headers['Accept-Language'] = language;
      
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
        storage.removeItem('authToken');
        storage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

