/**
 * Componente de formulário de login
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { useAuth } from '@/context/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { ReactivateAccountModal } from '@/components/account/ReactivateAccountModal';
import { accountService } from '@/lib/account-service';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await login(data.email, data.password);

      // Verifica se a conta está marcada para deleção
      try {
        const deleteStatus = await accountService.getDeleteStatus();
        if (deleteStatus.status === 'PENDING_DELETION') {
          setShowReactivateModal(true);
          return;
        }
      } catch (error) {
        // Ignora erro ao verificar status de deleção
        console.log('Status de deleção não disponível');
      }

      reset();
      router.push('/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const message = axiosError.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactivateSuccess = () => {
    setShowReactivateModal(false);
    reset();
    router.push('/dashboard');
  };

  const handleReactivateCancel = () => {
    setShowReactivateModal(false);
    router.push('/login');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          placeholder="seu@email.com"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Senha */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha
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

      {/* Mensagem de erro */}
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Botão de login */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>

      {/* Link para registro */}
      <p className="text-center text-sm text-gray-600">
        Não tem uma conta?{' '}
        <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Criar conta
        </Link>
      </p>

      {/* Modal de Reativação */}
      {showReactivateModal && (
        <ReactivateAccountModal
          onSuccess={handleReactivateSuccess}
          onCancel={handleReactivateCancel}
        />
      )}
    </form>
  );
};

