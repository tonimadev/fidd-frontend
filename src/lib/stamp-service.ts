/**
 * Serviço de carimbos
 */

import { apiClient } from './api-client';

const STAMPS_BASE_URL = '/api/v1/stamps';

export interface ManualPunchRequest {
  identifier: string;
  campaignId: number;
  punchCount?: number;
  bypassWarnings?: boolean;
}

export interface ManualPunchResponse {
  message: string;
  warning?: {
    cardsNeeded: number;
    cardsAvailable: number;
    currentPoints: number;
    pointsRequired: number;
    punchesRemainingToComplete: number;
  };
}

export const stampService = {
  /**
   * Aplica um carimbo manual por identificador
   */
  async manualPunch(data: ManualPunchRequest): Promise<ManualPunchResponse> {
    const response = await apiClient.post<ManualPunchResponse>(`${STAMPS_BASE_URL}/manual`, data);
    return response.data;
  },
};
