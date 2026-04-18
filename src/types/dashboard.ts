/**
 * Tipos relacionados ao dashboard
 */

export type DashboardTab = 'home' | 'insights' | 'campaigns' | 'customers' | 'redemptions' | 'settings' | 'subscriptions' | 'developers' | 'simulator' | 'admin-panel' | 'nfc';

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

export interface HeatmapData {
  dayOfWeek: number;
  hourOfDay: number;
  count: number;
}

export interface TopCustomerData {
  customerName: string;
  totalPunches: number;
  totalRedemptions: number;
}

export interface StoreInsights {
  heatmap: HeatmapData[];
  topCustomers: TopCustomerData[];
  completionRate: number;
  averageReturnTimeDays: number;
  totalActiveCustomers: number;
  totalPunchesToday: number;
}

