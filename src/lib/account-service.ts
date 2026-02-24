/**
 * Serviço de gerenciamento de conta
 */

import { apiClient } from './api-client';
import { DeleteAccountStatus, DeleteAccountRequest } from '@/types/account';

const ACCOUNT_BASE_URL = '/api/web/v1/account';

export const accountService = {
  /**
   * Verifica o status de deleção da conta
   */
  async getDeleteStatus(): Promise<DeleteAccountStatus> {
    const response = await apiClient.get<DeleteAccountStatus>(`${ACCOUNT_BASE_URL}/delete`);
    return response.data;
  },

  /**
   * Solicita a deleção da conta (será deletada em 30 dias)
   */
  async requestAccountDeletion(password: string): Promise<DeleteAccountStatus> {
    const response = await apiClient.put<DeleteAccountStatus>(
      `${ACCOUNT_BASE_URL}/delete`,
      { password } as DeleteAccountRequest
    );
    return response.data;
  },

  /**
   * Cancela uma solicitação de deleção de conta
   */
  async cancelAccountDeletion(): Promise<DeleteAccountStatus> {
    const response = await apiClient.delete<DeleteAccountStatus>(`${ACCOUNT_BASE_URL}/delete`);
    return response.data;
  },
};

