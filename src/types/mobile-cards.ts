/**
 * Tipos de cartões para o cliente (mobile)
 */

export interface CampaignReward {
  id: number;
  name: string;
  pointsRequired: number;
  isRedeemed: boolean;
  canRedeem: boolean;
}

export interface MobileCardResponse {
  id: number;
  campaignName: string;
  storeName: string;
  storeId: number;
  storeSlug: string;
  currentPoints: number;
  pointsRequired: number;
  progress: number;
  status: string;
  canRedeem: boolean;
  campaignDescription?: string;
  imageUrl?: string;
  highlightColor?: string;
  isStorePro: boolean;
  expirationDate?: string;
  redeemedAt?: string;
  rewards: CampaignReward[];
}

export interface PunchCollectRequest {
  cardId: number;
  qrToken: string;
  isQrCode: boolean;
}

export interface PunchCollectResponse {
  success: boolean;
  newScore: number;
  pointsRemaining: number;
  message: string;
}

export interface MobileRedemptionResponse {
  success: boolean;
  redemptionCode: string;
  message: string;
}

export interface MobileInvitationRedeemResponse {
  success: boolean;
  cardId: number;
  campaignName: string;
  storeName: string;
  currentPoints: number;
  pointsRequired: number;
  message: string;
}

export interface PunchHistoryResponse {
  id: number;
  storeName: string;
  campaignName: string;
  method: string;
  createdAt: string;
}
