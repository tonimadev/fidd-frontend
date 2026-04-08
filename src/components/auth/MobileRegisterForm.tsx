/**
 * Componente de formulário de registro para o cliente (mobile)
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mobileRegisterSchema, MobileRegisterFormData } from '@/lib/validations';
import { useMobileAuth } from '@/context/mobile-auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { getFriendlyErrorMessage } from '@/lib/error-handler';
import { mobileCardService } from '@/lib/mobile-card-service';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GoogleLogin } from '@react-oauth/google';

export const MobileRegisterForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('inviteToken');
  const { register: registerUser, loginWithGoogle } = useMobileAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MobileRegisterFormData>({
    resolver: zodResolver(mobileRegisterSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: MobileRegisterFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await registerUser(data);
      
      // Resgatar convite se houver token
      if (inviteToken) {
        try {
          await mobileCardService.redeemInvitation(inviteToken);
        } catch (err) {
          console.error('Erro ao resgatar convite após registro:', err);
        }
      }

      reset();
      router.push('/app');
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'Erro ao criar conta. Tente novamente.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {inviteToken && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-4 text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">Convite Detectado!</p>
          <p className="text-[10px] text-primary/70">Crie sua conta para resgatar seus pontos automaticamente.</p>
        </div>
      )}
      <Input
        label="Nome Completo"
        type="text"
        placeholder="Seu nome"
        error={errors.name?.message}
        maxLength={100}
        {...register('name')}
      />

      <Input
        label="Celular"
        type="tel"
        placeholder="11988887777"
        error={errors.phone?.message}
        maxLength={15}
        {...register('phone')}
      />

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

      <Input
        label="Confirmar Senha"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        maxLength={100}
        {...register('confirmPassword')}
      />

      {/* Mensagem de erro */}
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-3 border border-red-200">
          <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Botão de registro */}
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg rounded-xl"
        isLoading={isSubmitting}
      >
        Criar Conta
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-gray-500">Ou use sua conta</span>
        </div>
      </div>

      <div className="flex justify-center w-full">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            if (credentialResponse.credential) {
              try {
                setIsSubmitting(true);
                setErrorMessage('');
                await loginWithGoogle(credentialResponse.credential);
                router.push('/app');
              } catch (error) {
                setErrorMessage(getFriendlyErrorMessage(error, 'Erro ao criar conta com Google.'));
              } finally {
                setIsSubmitting(false);
              }
            }
          }}
          onError={() => {
            setErrorMessage('Falha na autenticação com Google.');
          }}
          useOneTap
          width="100%"
          theme="outline"
          text="signup_with"
          shape="rectangular"
        />
      </div>

      {/* Link para login */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Já tem uma conta?{' '}
        <Link 
          href={`/app/login${inviteToken ? `?inviteToken=${inviteToken}` : ''}`} 
          className="text-primary hover:underline font-semibold transition-all"
        >
          Fazer login
        </Link>
      </p>
    </form>
  );
};
