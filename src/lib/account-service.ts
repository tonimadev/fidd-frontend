/**
 * Serviço de gerenciamento de conta
 */

import { apiClient } from './api-client';
import { DeleteAccountStatus, DeleteAccountRequest, ApiKey, CreateApiKeyRequest, StoreProfile, StoreProfileUpdateRequest } from '@/types/account';
import { LoginRequest } from '@/types/auth';

const ACCOUNT_BASE_URL = '/api/web/v1/account';
const API_KEYS_BASE_URL = '/api/web/v1/api-keys';
const PROFILE_BASE_URL = '/api/web/v1/profile';

export const accountService = {
  /**
   * Obtém o perfil da loja
   */
  async getProfile(): Promise<StoreProfile> {
    const response = await apiClient.get<StoreProfile>(PROFILE_BASE_URL);
    return response.data;
  },

  /**
   * Atualiza o perfil da loja
   */
  async updateProfile(data: StoreProfileUpdateRequest): Promise<void> {
    await apiClient.put(PROFILE_BASE_URL, data);
  },

  /**
   * Atualiza o endereço da loja
   */
  async updateAddress(data: StoreProfileUpdateRequest): Promise<void> {
    await apiClient.put(`${PROFILE_BASE_URL}/address`, data);
  },

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
   * Cancela uma solicitação de deleção de conta (quando autenticado)
   */
  async cancelAccountDeletion(): Promise<DeleteAccountStatus> {
    const response = await apiClient.delete<DeleteAccountStatus>(`${ACCOUNT_BASE_URL}/delete`);
    return response.data;
  },

  /**
   * Cancela uma solicitação de deleção de conta usando credenciais
   * (Usado na página de login)
   */
  async cancelDeletionWithCredentials(data: LoginRequest): Promise<DeleteAccountStatus> {
    const response = await apiClient.post<DeleteAccountStatus>(
      `${ACCOUNT_BASE_URL}/cancel-deletion-with-credentials`,
      data
    );
    return response.data;
  },

  /**
   * Lista todas as chaves de API da conta
   */
  async listApiKeys(): Promise<ApiKey[]> {
    const response = await apiClient.get<ApiKey[]>(API_KEYS_BASE_URL);
    return response.data;
  },

  /**
   * Cria uma nova chave de API
   */
  async createApiKey(data: CreateApiKeyRequest): Promise<ApiKey> {
    const response = await apiClient.post<ApiKey>(API_KEYS_BASE_URL, data);
    return response.data;
  },

  /**
   * Revoga (deleta) uma chave de API
   */
  async revokeApiKey(id: number): Promise<void> {
    await apiClient.delete(`${API_KEYS_BASE_URL}/${id}`);
  },
};

