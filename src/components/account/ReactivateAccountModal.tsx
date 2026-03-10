/**
 * Modal para reativar conta deletada
 */

'use client';

import React, { useState } from 'react';
import { accountService } from '@/lib/account-service';
import { AxiosError } from 'axios';
import { LoginRequest } from '@/types/auth';

interface ReactivateAccountModalProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  credentials?: LoginRequest;
}

export const ReactivateAccountModal: React.FC<ReactivateAccountModalProps> = ({
  onSuccess,
  onCancel,
  credentials,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleReactivate = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      if (credentials) {
        // Usar endpoint público com credenciais
        await accountService.cancelDeletionWithCredentials(credentials);
      } else {
        // Usar endpoint autenticado
        await accountService.cancelAccountDeletion();
      }

      setSuccessMessage('Sua conta foi reativada com sucesso! Redirecionando...');

      // Redireciona para dashboard após 2 segundos
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        'Erro ao reativar conta. Tente novamente.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-amber-100 p-3 text-amber-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Conta em processo de exclusão</h3>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Esta conta está programada para ser apagada permanentemente em breve (período de carência de 30 dias).
          </p>
          <p className="mt-2 text-gray-600 font-medium">
            Deseja cancelar a exclusão e reativar seu acesso agora?
          </p>
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 border border-red-100">
            <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mt-6 rounded-xl bg-green-50 p-4 border border-green-100 flex items-center gap-3">
            <div className="bg-green-500 text-white rounded-full p-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-green-700 font-bold">{successMessage}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleReactivate}
            disabled={isLoading}
            className="w-full rounded-xl bg-primary px-6 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-400 disabled:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : (
              'Reativar Minha Conta'
            )}
          </button>
          
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="w-full rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
};

