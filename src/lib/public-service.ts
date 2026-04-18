import { apiClient } from './api-client';

export interface PublicStore {
  name: string;
  logoUrl: string | null;
  description: string | null;
  highlightColor: string | null;
  slug: string;
  activeCampaigns: PublicCampaign[];
}

export interface PublicCampaign {
  id: number;
  name: string;
  description: string | null;
  pointsRequired: number;
  imageUrl: string | null;
  expirationDate: string | null;
  rewards: PublicReward[];
}

export interface PublicReward {
  name: string;
  pointsRequired: number;
}

export const publicService = {
  async getStoreBySlug(slug: string): Promise<PublicStore> {
    const response = await apiClient.get<PublicStore>(`/api/public/v1/stores/${slug}`);
    return response.data;
  }
};
