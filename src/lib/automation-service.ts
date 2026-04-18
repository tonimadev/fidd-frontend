import { apiClient } from './api-client';

export interface WinBackConfig {
  enabled: boolean;
  days: number;
  isPro: boolean;
}

export interface WinBackLog {
  customerName: string;
  customerEmail: string;
  sentAt: string;
}

const AUTOMATION_BASE_URL = '/api/web/v1/automations';

export const automationService = {
  async getWinBackConfig(): Promise<WinBackConfig> {
    const response = await apiClient.get<WinBackConfig>(`${AUTOMATION_BASE_URL}/win-back/config`);
    return response.data;
  },

  async updateWinBackConfig(config: { enabled: boolean; days: number }): Promise<void> {
    await apiClient.put(`${AUTOMATION_BASE_URL}/win-back/config`, config);
  },

  async getWinBackHistory(): Promise<WinBackLog[]> {
    const response = await apiClient.get<WinBackLog[]>(`${AUTOMATION_BASE_URL}/win-back/history`);
    return response.data;
  }
};
