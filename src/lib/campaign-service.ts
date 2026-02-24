/**
 * Serviço de campanhas
 */

import { apiClient } from './api-client';
import { Campaign, CreateCampaignRequest, UpdateCampaignRequest } from '@/types/campaign';

const CAMPAIGNS_BASE_URL = '/api/web/v1/campaigns';

export const campaignService = {
  /**
   * Lista todas as campanhas da loja autenticada
   */
  async listCampaigns(): Promise<Campaign[]> {
    const response = await apiClient.get<Campaign[]>(CAMPAIGNS_BASE_URL);
    return response.data;
  },

  /**
   * Cria uma nova campanha
   */
  async createCampaign(data: CreateCampaignRequest): Promise<Campaign> {
    const response = await apiClient.post<Campaign>(CAMPAIGNS_BASE_URL, data);
    return response.data;
  },

  /**
   * Atualiza uma campanha existente
   */
  async updateCampaign(id: number, data: UpdateCampaignRequest): Promise<Campaign> {
    const response = await apiClient.put<Campaign>(`${CAMPAIGNS_BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Deleta uma campanha
   */
  async deleteCampaign(id: number): Promise<void> {
    await apiClient.delete(`${CAMPAIGNS_BASE_URL}/${id}`);
  },
};

