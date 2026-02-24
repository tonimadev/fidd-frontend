/**
 * Componente de configurações de conta
 */

'use client';

import React, { useState, useEffect } from 'react';
import { accountService } from '@/lib/account-service';
import { DeleteAccountStatus } from '@/types/account';
import { DeleteAccountModal } from './DeleteAccountModal';

export const AccountSettings: React.FC = () => {
  const [deleteStatus, setDeleteStatus] = useState<DeleteAccountStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadDeleteStatus();
  }, []);

  const loadDeleteStatus = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const status = await accountService.getDeleteStatus();
      setDeleteStatus(status);
    } catch (error) {
      setErrorMessage('Erro ao carregar status da conta. Tente novamente.');
      console.error('Erro ao carregar status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDeletion = async () => {
    if (!confirm('Tem certeza que deseja cancelar a deleção da sua conta?')) {
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const status = await accountService.cancelAccountDeletion();
      setDeleteStatus(status);
    } catch (error) {
      setErrorMessage('Erro ao cancelar deleção. Tente novamente.');
      console.error('Erro ao cancelar deleção:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    loadDeleteStatus();
  };

  const isPendingDeletion = deleteStatus?.status === 'PENDING_DELETION';

  if (isLoading && !deleteStatus) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Configurações da Conta</h2>

      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Seção de Deleção de Conta */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Gerenciamento de Conta</h3>
          <p className="mt-1 text-sm text-gray-600">
            Opções para gerenciar sua conta na plataforma
          </p>
        </div>

        {isPendingDeletion ? (
          // Status de deleção pendente
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-red-900">Sua conta está marcada para deleção</h4>
                <p className="mt-1 text-sm text-red-700">
                  Sua conta será permanentemente deletada em{' '}
                  <strong>{deleteStatus.daysRemaining} dias</strong> ({deleteStatus.scheduledDeletionDate}).
                </p>
                <p className="mt-2 text-sm text-red-700">
                  Se deseja manter sua conta, você pode cancelar a deleção clicando no botão abaixo.
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleCancelDeletion}
                disabled={isLoading}
                className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-gray-400"
              >
                {isLoading ? 'Cancelando...' : 'Cancelar Deleção'}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isLoading}
                className="rounded-lg border border-red-600 px-4 py-2 font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:bg-gray-100"
              >
                Confirmar Deleção Imediata
              </button>
            </div>
          </div>
        ) : (
          // Conta ativa
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 border border-green-200">
              <p className="text-sm font-semibold text-green-900">
                Sua conta está ativa
              </p>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h4 className="font-semibold text-red-900">Zona de Perigo</h4>
              <p className="mt-2 text-sm text-red-700">
                Deletar sua conta é uma ação permanente. Todos os seus dados, campanhas e histórico serão perdidos.
              </p>
              <p className="mt-1 text-sm text-red-700">
                Você terá 30 dias para mudar de ideia e reativar sua conta. Após esse período, a deleção será permanente.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700"
              >
                Deletar Conta
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Deleção */}
      {showDeleteModal && (
        <DeleteAccountModal
          onSuccess={handleDeleteSuccess}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

