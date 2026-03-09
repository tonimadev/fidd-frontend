/**
 * Serviço de resgate de prêmios
 */

import { apiClient } from './api-client';
import { RedemptionRequest, RedemptionResponse } from '@/types/redemption';

const REDEMPTIONS_BASE_URL = '/api/web/v1/redemptions';

export const redemptionService = {
  /**
   * Valida e realiza o resgate de um prêmio através de um código de 6 caracteres
   */
  async validateRedemption(data: RedemptionRequest): Promise<RedemptionResponse> {
    const response = await apiClient.post<RedemptionResponse>(`${REDEMPTIONS_BASE_URL}/validate`, data);
    return response.data;
  },
};
