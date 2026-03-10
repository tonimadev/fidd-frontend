/**
 * Componente de formulário de login
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { getFriendlyErrorMessage } from '@/lib/error-handler';
import Link from 'next/link';
import { ReactivateAccountModal } from '@/components/account/ReactivateAccountModal';
import { accountService } from '@/lib/account-service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const LoginForm: React.FC = () => {
  const router = useRouter();
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
      } catch {
        // Ignora erro ao verificar status de deleção
        console.log('Status de deleção não disponível');
      }

      reset();
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'Erro ao fazer login. Tente novamente.'));
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        maxLength={255}
        {...register('email')}
      />

      <Input
        label="Senha"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        maxLength={100}
        {...register('password')}
      />

      {/* Mensagem de erro */}
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-3 border border-red-200">
          <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Botão de login */}
      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        Entrar
      </Button>

      {/* Link para registro */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Não tem uma conta?{' '}
        <Link href="/register" className="text-primary hover:underline font-semibold transition-all">
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

