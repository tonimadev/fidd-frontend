/**
 * Serviço de dashboard
 */

import { apiClient } from './api-client';
import { DashboardMetrics } from '@/types/dashboard';

const DASHBOARD_BASE_URL = '/api/web/v1/dashboard';

export const dashboardService = {
  /**
   * Obtém as métricas da home do dashboard
   */
  async getHomeMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get<DashboardMetrics>(`${DASHBOARD_BASE_URL}/home`);
    return response.data;
  },
};

