/**
 * Componente de formulário de redefinição de senha
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/validations';
import { storage } from '@/lib/storage';
import { authService } from '@/lib/auth-service';
import { getFriendlyErrorMessage } from '@/lib/error-handler';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await authService.resetPassword({
        email: data.email,
        token: data.token,
        newPassword: data.newPassword,
        userType: 'STORE',
      });
      setIsSuccess(true);
      
      // Limpa dados de usuário local para garantir que não caia em fluxos de verificação antigos
      // já que a senha mudou e o email foi validado automaticamente no backend
      storage.removeItem('user');
      storage.removeItem('authToken');
      
      // Redireciona após 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'Erro ao redefinir senha. O token pode estar expirado ou é inválido.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Senha alterada com sucesso!</h3>
          <p className="text-muted-foreground">
            Sua senha foi atualizada. Você será redirecionado para a tela de login em instantes.
          </p>
        </div>
        <Link href="/login" className="block">
          <Button className="w-full">
            Ir para o login agora
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2 text-center mb-6">
        <p className="text-sm text-muted-foreground">
          Confirme seu e-mail e digite sua nova senha abaixo.
        </p>
      </div>

      {/* Campo oculto para o token para que o Zod possa validar */}
      <input type="hidden" {...register('token')} />

      <Input
        label="Email"
        type="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        maxLength={255}
        {...register('email')}
      />

      <Input
        label="Nova Senha"
        type="password"
        placeholder="••••••••"
        error={errors.newPassword?.message}
        maxLength={100}
        {...register('newPassword')}
      />

      <Input
        label="Confirmar Nova Senha"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        maxLength={100}
        {...register('confirmPassword')}
      />

      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-3 border border-red-200">
          <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        Alterar senha
      </Button>

      <div className="text-center mt-4">
        <Link href="/login" className="text-sm text-primary hover:underline font-semibold transition-all">
          Voltar para o login
        </Link>
      </div>
    </form>
  );
};
