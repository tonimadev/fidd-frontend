/**
 * Serviço de API para check-in por proximidade
 */

import { apiClient } from './api-client';

export interface ProximityCheckinRequest {
  storeId: number;
  latitude: number;
  longitude: number;
  campaignId?: number;
}

export interface ProximityCheckinResponse {
  success: boolean;
  message: string;
  storeName?: string;
  campaignName?: string;
  newScore?: number;
  pointsRemaining?: number;
  distanceMeters?: number;
}

const BASE_URL = '/api/mobile/v1/proximity';

export const proximityCheckinService = {
  /**
   * Realiza check-in por proximidade GPS
   */
  async checkin(data: ProximityCheckinRequest): Promise<ProximityCheckinResponse> {
    const response = await apiClient.post<ProximityCheckinResponse>(`${BASE_URL}/checkin`, data);
    return response.data;
  },
};
