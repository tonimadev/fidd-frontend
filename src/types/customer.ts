/**
 * Tipos relacionados a clientes e seus cartões
 */

export type CardStatus = 'IN_PROGRESS' | 'COMPLETED' | 'REDEEMED' | 'EXPIRED';

export interface CustomerCard {
  id: string;
  campaignId: number;
  campaignName: string;
  currentPoints: number;
  pointsRequired: number;
  status: CardStatus;
  updatedAt: string;
  redeemedAt?: string;
  expiredAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalCards: number;
  activeCards: number;
  lastActivity: string;
  cards?: CustomerCard[];
}
