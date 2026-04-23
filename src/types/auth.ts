/**
 * Tipos de autenticação
 */

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  publicId?: string;
  slug?: string;
  storeId?: number;
  tradeName: string;
  email: string;
  role: string;
  plan?: string;
  profilePictureUrl?: string;
  description?: string;
  isNewUser?: boolean;
  emailVerified?: boolean;
}

export interface AuthContext {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAccountPendingDeletion: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (tradeName: string, taxId: string, email: string, password: string, description?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

export interface User {
  id: number;
  publicId?: string;
  slug?: string;
  storeId?: number;
  tradeName: string;
  email: string;
  role: string;
  plan?: string;
  profilePictureUrl?: string;
  description?: string;
  isNewUser?: boolean;
  emailVerified?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
  userType: 'STORE' | 'CUSTOMER';
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  userType: 'STORE' | 'CUSTOMER';
}

export interface RegisterRequest {
  tradeName: string;
  taxId: string; // CNPJ ou CPF (14 ou 11 dígitos)
  taxIdType: 'CNPJ' | 'CPF'; // Tipo de documento
  email: string;
  description?: string;
  password: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
