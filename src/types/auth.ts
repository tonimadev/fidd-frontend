/**
 * Tipos de autenticação
 */

export interface AuthResponse {
  token: string;
  type: string;
  storeId: number;
  tradeName: string;
  email: string;
  role: string;
}

export interface AuthContext {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAccountPendingDeletion: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (tradeName: string, taxId: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface User {
  storeId: number;
  tradeName: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  tradeName: string;
  taxId: string; // CNPJ ou CPF (14 ou 11 dígitos)
  taxIdType: 'CNPJ' | 'CPF'; // Tipo de documento
  email: string;
  password: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}


