/**
 * Serviço de clientes
 */

import { apiClient } from './api-client';
import { Customer } from '@/types/customer';

const CUSTOMERS_BASE_URL = '/api/web/v1/customers';

import { OffsetResponse } from '@/types/pagination';

export const customerService = {
  /**
   * Lista todos os clientes da loja
   */
  async listCustomers(page = 0, size = 10): Promise<OffsetResponse<Customer>> {
    const response = await apiClient.get<OffsetResponse<Customer>>(CUSTOMERS_BASE_URL, {
      params: { page, size }
    });
    return response.data;
  },
};
