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
  address?: string;
  latitude?: number;
  longitude?: number;
  profilePictureUrl?: string;
  planName?: string;
}

export interface UpdateStoreAdminRequest {
  tradeName: string;
  taxId: string;
  email: string;
  isActive: boolean;
  address?: string;
  latitude?: number;
  longitude?: number;
  adminPassword?: string;
}

export interface AdminCustomer {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminCampaign {
  id: number;
  storeId: number;
  storeName: string;
  name: string;
  createdAt: string;
  expirationDate?: string;
  isActive: boolean;
  totalPunches: number;
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

  getStoreById: async (id: number): Promise<AdminStore> => {
    const response = await api.get<AdminStore>(`${ADMIN_BASE_URL}/stores/${id}`);
    return response.data;
  },

  updateStore: async (id: number, request: UpdateStoreAdminRequest): Promise<void> => {
    await api.put(`${ADMIN_BASE_URL}/stores/${id}`, request);
  },

  resetStorePassword: async (id: number, adminPassword: string): Promise<string> => {
    const response = await api.post<{ temporaryPassword: string }>(
      `${ADMIN_BASE_URL}/stores/${id}/reset-password`,
      { adminPassword }
    );
    return response.data.temporaryPassword;
  },

  getCustomers: async (page = 0, size = 10): Promise<PagedResponse<AdminCustomer>> => {
    const response = await api.get<PagedResponse<AdminCustomer>>(`${ADMIN_BASE_URL}/customers?page=${page}&size=${size}`);
    return response.data;
  },

  getCampaigns: async (page = 0, size = 10): Promise<PagedResponse<AdminCampaign>> => {
    const response = await api.get<PagedResponse<AdminCampaign>>(`${ADMIN_BASE_URL}/campaigns?page=${page}&size=${size}`);
    return response.data;
  },

  updateCampaignStatus: async (id: number, isActive: boolean): Promise<void> => {
    await api.patch(`${ADMIN_BASE_URL}/campaigns/${id}/status`, { isActive });
  },
};
