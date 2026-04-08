/**
 * Tipos de autenticação para o cliente (mobile)
 */

export interface MobileAuthResponse {
  token: string;
  type: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}

export interface MobileUser {
  userId: number;
  name: string;
  email: string;
  role: string;
}

export interface MobileRegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}
