/**
 * Tipos relacionados à conta de usuário
 */

export interface DeleteAccountStatus {
  status: 'ACTIVE' | 'PENDING_DELETION';
  scheduledDeletionDate?: string;
  daysRemaining?: number;
  message?: string;
}

export interface DeleteAccountRequest {
  password: string;
}

