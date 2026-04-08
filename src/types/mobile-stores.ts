/**
 * Tipos de lojas para o cliente (mobile)
 */

export interface MobileStoreNearbyResponse {
  id: number;
  tradeName: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}
