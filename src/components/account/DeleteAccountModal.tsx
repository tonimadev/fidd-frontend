/**
 * Modal para confirmar deleção de conta
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deleteAccountSchema, DeleteAccountFormData } from '@/lib/validations';
import { accountService } from '@/lib/account-service';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

interface DeleteAccountModalProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onSuccess, onCancel }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: DeleteAccountFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      await accountService.requestAccountDeletion(data.password);

      // Logout do usuário
      logout();

      // Redireciona para página de login com mensagem
      router.push('/login?deleted=true');
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const message = axiosError.response?.data?.message || 'Erro ao deletar conta. Verifique sua senha.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900">Confirmar Deleção de Conta</h3>

        <p className="mt-3 text-sm text-gray-600">
          Esta ação não pode ser desfeita imediatamente. Você terá 30 dias para mudar de ideia.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {errorMessage && (
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {/* Avisos */}
          <div className="space-y-2 rounded-lg bg-yellow-50 p-3 border border-yellow-200">
            <p className="text-xs font-semibold text-yellow-900">Atenção:</p>
            <ul className="text-xs text-yellow-800 space-y-1 list-disc list-inside">
              <li>Todos os dados serão deletados</li>
              <li>Campanhas e histórico serão perdidos</li>
              <li>30 dias para reativar a conta</li>
              <li>Após 30 dias, deleção será permanente</li>
            </ul>
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Digite sua senha para confirmar
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              placeholder="••••••••"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirmação */}
          <div className="flex items-center">
            <input
              {...register('confirmDeletion')}
              type="checkbox"
              id="confirmDeletion"
              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="confirmDeletion" className="ml-2 block text-sm text-gray-700">
              Confirmo que desejo deletar minha conta permanentemente
            </label>
          </div>
          {errors.confirmDeletion && (
            <p className="text-sm text-red-600">{errors.confirmDeletion.message}</p>
          )}

          {/* Botões */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Deletando...' : 'Deletar Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

