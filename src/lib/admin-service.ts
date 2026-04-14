import { api } from './api';

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
    const response = await api.get<AdminStats>('/admin/v1/stats');
    return response.data;
  },

  getStores: async (page = 0, size = 10): Promise<PagedResponse<AdminStore>> => {
    const response = await api.get<PagedResponse<AdminStore>>(`/admin/v1/stores?page=${page}&size=${size}`);
    return response.data;
  },

  updateStoreStatus: async (id: number, isActive: boolean): Promise<void> => {
    await api.patch(`/admin/v1/stores/${id}/status`, { isActive });
  },
};
