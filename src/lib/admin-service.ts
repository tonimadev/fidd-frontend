import { apiClient as api } from './api-client';

const ADMIN_BASE_URL = '/api/admin/v1';

export interface AdminStats {
  totalStores: number;
  totalCustomers: number;
  activeCampaigns: number;
}

export interface AdminStore {
  id: number;
  tradeName: string;
  email: string;
  taxId: string;
  isActive: boolean;
  subscriptionStatus: string;
  registrationCompleted: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get<AdminStats>(`${ADMIN_BASE_URL}/stats`);
    return response.data;
  },

  getStores: async (page = 0, size = 10): Promise<PagedResponse<AdminStore>> => {
    const response = await api.get<PagedResponse<AdminStore>>(`${ADMIN_BASE_URL}/stores?page=${page}&size=${size}`);
    return response.data;
  },

  updateStoreStatus: async (id: number, isActive: boolean): Promise<void> => {
    await api.patch(`${ADMIN_BASE_URL}/stores/${id}/status`, { isActive });
  },
};
