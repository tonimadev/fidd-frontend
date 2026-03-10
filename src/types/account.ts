/**
 * Tipos relacionados à conta de usuário
 */

export interface DeleteAccountStatus {
  status: 'ACTIVE' | 'PENDING_DELETION';
  deletionRequestedAt?: string | null;
  permanentDeletionScheduledAt?: string | null;
  gracePeriodDays?: number;
  message?: string;
  // Mantendo compatibilidade com código existente se necessário
  scheduledDeletionDate?: string;
  daysRemaining?: number;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface ApiKey {
  id: number;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface CreateApiKeyRequest {
  name: string;
}

