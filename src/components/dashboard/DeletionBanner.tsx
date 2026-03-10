/**
 * Banner de aviso para conta em processo de exclusão
 */

'use client';

import React, { useState, useEffect } from 'react';
import { accountService } from '@/lib/account-service';
import { DeleteAccountStatus } from '@/types/account';

export const DeletionBanner: React.FC = () => {
  const [status, setStatus] = useState<DeleteAccountStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await accountService.getDeleteStatus();
        if (data.status === 'PENDING_DELETION') {
          setStatus(data);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Erro ao buscar status de exclusão:', error);
      }
    };

    fetchStatus();
  }, []);

  const handleCancelDeletion = async () => {
    try {
      setIsLoading(true);
      await accountService.cancelAccountDeletion();
      setIsVisible(false);
      // Opcional: Recarregar a página ou mostrar um toast de sucesso
      window.location.reload();
    } catch (error) {
      console.error('Erro ao cancelar exclusão:', error);
      alert('Erro ao cancelar a exclusão da conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible || !status) return null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'em breve';
    try {
      return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
    } catch {
      return 'em breve';
    }
  };

  const deletionDate = status.permanentDeletionScheduledAt || status.scheduledDeletionDate;

  return (
    <div className="bg-red-600 text-white px-4 py-2 shadow-lg relative z-40 animate-in slide-in-from-top duration-300">
      <div className="container mx-auto flex items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm font-bold tracking-tight">
            Atenção: Sua conta será excluída em {formatDate(deletionDate)}.
          </p>
          <button
            onClick={handleCancelDeletion}
            disabled={isLoading}
            className="ml-2 text-sm font-black underline decoration-2 underline-offset-4 hover:text-red-100 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Cancelando...' : 'Clique aqui para cancelar a exclusão'}
          </button>
        </div>
      </div>
    </div>
  );
};
