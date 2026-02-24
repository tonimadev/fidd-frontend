/**
 * Modal para reativar conta deletada
 */

'use client';

import React, { useState } from 'react';
import { accountService } from '@/lib/account-service';
import { AxiosError } from 'axios';

interface ReactivateAccountModalProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReactivateAccountModal: React.FC<ReactivateAccountModalProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleReactivate = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Usar cancelAccountDeletion para reativar a conta
      const status = await accountService.cancelAccountDeletion();

      setSuccessMessage('Sua conta foi reativada com sucesso! Redirecionando...');

      // Redireciona para dashboard após 2 segundos
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const message =
        axiosError.response?.data?.message ||
        'Erro ao reativar conta. Tente novamente.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900">Sua Conta Está Marcada para Deleção</h3>

        <p className="mt-3 text-sm text-gray-600">
          Detectamos que sua conta está marcada para deleção permanente. Você pode reativar sua conta
          clicando no botão abaixo. Você terá 30 dias a partir de agora para mudar de ideia novamente.
        </p>

        {errorMessage && (
          <div className="mt-4 rounded-lg bg-red-50 p-3">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 rounded-lg bg-green-50 p-3">
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:bg-gray-100"
          >
            Continuar com Deleção
          </button>
          <button
            onClick={handleReactivate}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Reativando...' : 'Reativar Conta'}
          </button>
        </div>
      </div>
    </div>
  );
};

