/**
 * Serviço de clientes
 */

import { apiClient } from './api-client';
import { Customer } from '@/types/customer';

const CUSTOMERS_BASE_URL = '/api/web/v1/customers';

export const customerService = {
  /**
   * Lista todos os clientes da loja
   */
  async listCustomers(): Promise<Customer[]> {
    const response = await apiClient.get<Customer[]>(CUSTOMERS_BASE_URL);
    return response.data;
  },
};
