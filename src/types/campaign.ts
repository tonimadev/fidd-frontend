/**
 * Tipos relacionados a campanhas
 */

export interface Reward {
  id?: number;
  name: string;
  pointsRequired: number;
}

export interface Campaign {
  id: number;
  name: string;
  pointsRequired: number;
  isActive: boolean;
  expirationDate: string; // YYYY-MM-DD
  storeId: number;
  description?: string;
  benefitType?: string;
  rewards?: Reward[];
}

export interface CreateCampaignRequest {
  name: string;
  pointsRequired: number;
  expirationDate: string; // YYYY-MM-DD
  description?: string;
  isActive?: boolean;
  rewards?: Reward[];
}

export interface UpdateCampaignRequest {
  name: string;
  pointsRequired: number;
  expirationDate: string; // YYYY-MM-DD
  isActive: boolean;
  description?: string;
  benefitType?: string;
  rewards?: Reward[];
}

