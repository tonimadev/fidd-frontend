/**
 * Serviço de lojas para clientes (mobile)
 */

import { apiClient } from './api-client';
import { MobileStoreNearbyResponse } from '@/types/mobile-stores';

const BASE_URL = '/api/mobile/v1/stores';

export const mobileStoreService = {
  /**
   * Obtém lojas próximas ao cliente
   */
  async getNearbyStores(lat: number, lng: number, radiusKm: number = 10): Promise<MobileStoreNearbyResponse[]> {
    const response = await apiClient.get<MobileStoreNearbyResponse[]>(`${BASE_URL}/nearby`, {
      params: { lat, lng, radiusKm }
    });
    return response.data;
  }
};
