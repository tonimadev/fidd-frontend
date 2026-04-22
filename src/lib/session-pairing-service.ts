/**
 * Serviço de API para pareamento de sessão (Tap-to-Connect)
 *
 * Store-side: Cria sessões e envia selos
 * Client-side: Conecta via PIN e recebe selos
 */

import { apiClient } from './api-client';

// === Store-side types ===

export interface CreateSessionRequest {
  campaignId: number;
}

export interface SessionResponse {
  sessionId: string;
  pin: string;
  storeName: string;
  campaignName: string;
  status: string;
  expiresAt: string;
}

export interface SessionStatusResponse {
  sessionId: string;
  status: string;
  customerName?: string;
  stampCount: number;
  isExpired: boolean;
  error?: string;
}

export interface StampResultResponse {
  success: boolean;
  customerName?: string;
  campaignName?: string;
  newScore?: number;
  totalStamps?: number;
  message: string;
}

// === Client-side types ===

export interface JoinSessionResponse {
  success: boolean;
  sessionId?: string;
  storeName?: string;
  campaignName?: string;
  status?: string;
  message: string;
}

export interface CustomerSessionStatusResponse {
  sessionId: string;
  status: string;
  storeName?: string;
  campaignName?: string;
  stampCount: number;
  lastStampAt?: string;
  isExpired: boolean;
  error?: string;
}

// === Store-side API ===

const STORE_BASE = '/api/web/v1/sessions';

export const sessionPairingStoreService = {
  /**
   * Cria uma nova sessão de pareamento com PIN de 4 dígitos
   */
  async createSession(data: CreateSessionRequest): Promise<SessionResponse> {
    const response = await apiClient.post<SessionResponse>(`${STORE_BASE}/create`, data);
    return response.data;
  },

  /**
   * Consulta o status da sessão (para ver se cliente conectou)
   */
  async getSessionStatus(sessionId: string): Promise<SessionStatusResponse> {
    const response = await apiClient.get<SessionStatusResponse>(`${STORE_BASE}/${sessionId}/status`);
    return response.data;
  },

  /**
   * Envia um selo ao cliente pareado
   */
  async sendStamp(sessionId: string, points: number = 1): Promise<StampResultResponse> {
    const response = await apiClient.post<StampResultResponse>(`${STORE_BASE}/${sessionId}/stamp`, { points });
    return response.data;
  },
};

// === Client-side API ===

const CLIENT_BASE = '/api/mobile/v1/sessions';

export const sessionPairingClientService = {
  /**
   * Conecta a uma sessão usando o PIN de 4 dígitos
   */
  async joinSession(pin: string): Promise<JoinSessionResponse> {
    const response = await apiClient.post<JoinSessionResponse>(`${CLIENT_BASE}/join`, { pin });
    return response.data;
  },

  /**
   * Consulta o status da sessão (para receber eventos de selo)
   */
  async getSessionStatus(sessionId: string): Promise<CustomerSessionStatusResponse> {
    const response = await apiClient.get<CustomerSessionStatusResponse>(`${CLIENT_BASE}/${sessionId}/status`);
    return response.data;
  },
};
