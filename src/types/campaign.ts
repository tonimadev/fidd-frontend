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
  description?: string;
  benefitType?: string;
}

export interface CreateCampaignRequest {
  name: string;
  pointsRequired: number;
  expirationDate: string; // YYYY-MM-DD
  description?: string;
}

export interface UpdateCampaignRequest {
  name: string;
  pointsRequired: number;
  expirationDate: string; // YYYY-MM-DD
  isActive: boolean;
  description?: string;
  benefitType?: string;
}

