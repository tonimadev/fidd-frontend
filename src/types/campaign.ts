/**
 * Tipos relacionados a campanhas
 */

export interface Campaign {
  id: number;
  name: string;
  pointsRequired: number;
  isActive: boolean;
  expirationDate: string; // YYYY-MM-DD
  storeId: number;
}

export interface CreateCampaignRequest {
  name: string;
  pointsRequired: number;
  expirationDate: string; // YYYY-MM-DD
}

export interface UpdateCampaignRequest {
  name: string;
  pointsRequired: number;
  expirationDate: string; // YYYY-MM-DD
  isActive: boolean;
}

