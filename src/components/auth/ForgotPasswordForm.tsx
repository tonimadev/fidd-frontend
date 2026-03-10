/**
 * Componente de formulário de solicitação de recuperação de senha
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/validations';
import { authService } from '@/lib/auth-service';
import { getFriendlyErrorMessage } from '@/lib/error-handler';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const ForgotPasswordForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await authService.forgotPassword(data);
      setIsSuccess(true);
    } catch (error) {
      // Como recomendado, o backend deve retornar 200 mesmo se o email não existir,
      // mas se houver um erro real (rede, etc), tratamos aqui.
      setErrorMessage(getFriendlyErrorMessage(error, 'Erro ao processar solicitação. Tente novamente mais tarde.'));
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
          <h3 className="text-xl font-bold">Verifique seu e-mail</h3>
          <p className="text-muted-foreground">
            Se o e-mail informado estiver cadastrado, você receberá as instruções para redefinir sua senha em instantes.
          </p>
        </div>
        <Link href="/login" className="block">
          <Button variant="outline" className="w-full">
            Voltar para o login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2 text-center mb-6">
        <p className="text-sm text-muted-foreground">
          Informe seu e-mail abaixo e enviaremos um link para você definir uma nova senha.
        </p>
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        maxLength={255}
        {...register('email')}
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
        Enviar link de recuperação
      </Button>

      <div className="text-center mt-4">
        <Link href="/login" className="text-sm text-primary hover:underline font-semibold transition-all">
          Lembrou a senha? Fazer login
        </Link>
      </div>
    </form>
  );
};
