/**
 * Utilitário para tratamento de erros amigáveis
 */

import axios, { AxiosError } from 'axios';
import { ApiError } from '@/types/auth';

const errorMessages: Record<number, string> = {
  400: 'Dados inválidos. Por favor, verifique os campos preenchidos.',
  401: 'Sessão expirada ou não autorizada. Faça login novamente.',
  403: 'Você não tem permissão para realizar esta ação.',
  404: 'Recurso não encontrado.',
  409: 'Conflito de dados. Verifique se o registro já existe.',
  422: 'Erro de validação nos dados enviados.',
  429: 'Muitas requisições. Tente novamente em alguns minutos.',
  500: 'Erro interno no servidor. Tente novamente mais tarde.',
};

/**
 * Retorna uma mensagem de erro amigável para o usuário,
 * evitando exibir detalhes técnicos ou erros brutos do banco.
 */
export const getFriendlyErrorMessage = (error: unknown, fallbackMsg: string): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    // Se o backend retornou uma mensagem específica de negócio, usamos ela.
    // Filtramos mensagens que pareçam erros técnicos (SQL, Exception, etc)
    if (data?.message && 
        !data.message.toLowerCase().includes('sql') && 
        !data.message.toLowerCase().includes('exception') &&
        !data.message.toLowerCase().includes('database') &&
        !data.message.toLowerCase().includes('hibernate') &&
        !data.message.toLowerCase().includes('jpa')) {
      return data.message;
    }

    // Caso contrário, usamos mensagens amigáveis baseadas no status HTTP
    if (status && errorMessages[status]) {
      return errorMessages[status];
    }

    // Erros de conexão
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
    }

    if (axiosError.code === 'ECONNABORTED') {
      return 'Tempo esgotado ao conectar ao servidor. Tente novamente.';
    }
  }

  return fallbackMsg;
};
