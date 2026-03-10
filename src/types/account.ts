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

