/**
 * Tipos relacionados ao dashboard
 */

export type DashboardTab = 'home' | 'campaigns' | 'customers' | 'redemptions' | 'settings' | 'subscriptions';

export interface DashboardMetrics {
  activeCampaigns: number;
  totalCustomers: number;
  pointsDistributed: number;
  engagementRate: number;
  conversionRate: number;
  expirationVolume: number;
  monthlyLimit: number;
  availableCards: number;
}

