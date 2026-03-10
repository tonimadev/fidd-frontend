/**
 * Banner de aviso para conta em processo de exclusão
 */

'use client';

import React, { useState, useEffect } from 'react';
import { accountService } from '@/lib/account-service';
import { DeleteAccountStatus } from '@/types/account';
import { Button } from '@/components/ui/Button';

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
    <div className="bg-amber-600 text-white px-4 py-3 shadow-md relative">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm font-medium">
            Sua conta de lojista será excluída permanentemente em {formatDate(deletionDate)}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancelDeletion}
            isLoading={isLoading}
            className="bg-white text-amber-600 border-white hover:bg-amber-50 hover:text-amber-700 h-8 font-bold"
          >
            Cancelar Exclusão da Conta
          </Button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-amber-700 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
