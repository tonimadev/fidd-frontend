/**
 * Componente de formulário de login para o cliente (mobile)
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { useMobileAuth } from '@/context/mobile-auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { getFriendlyErrorMessage } from '@/lib/error-handler';
import { mobileCardService } from '@/lib/mobile-card-service';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GoogleLogin } from '@react-oauth/google';
import { EmailVerificationModal } from '@/components/auth/EmailVerificationModal';
import axios from 'axios';

export const MobileLoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('inviteToken');
  const { login, loginWithGoogle } = useMobileAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [tempCredentials, setTempCredentials] = useState<{email: string, password: string} | null>(null);

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

      // Resgatar convite se houver token
      if (inviteToken) {
        try {
          await mobileCardService.redeemInvitation(inviteToken);
        } catch (err) {
          console.error('Erro ao resgatar convite após login:', err);
        }
      }

      reset();
      router.push('/app');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const apiMessage = error.response.data?.message || '';
        if (apiMessage === 'authentication.email.not.verified' || apiMessage.toLowerCase().includes('e-mail não verificado')) {
           setUserEmail(data.email);
           setTempCredentials({ email: data.email, password: data.password });
           setShowEmailVerificationModal(true);
           return;
        }
      }
      setErrorMessage(getFriendlyErrorMessage(error, 'Erro ao fazer login. Tente novamente.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailVerificationSuccess = async () => {
    setShowEmailVerificationModal(false);
    try {
      if (tempCredentials) {
        setIsSubmitting(true);
        await login(tempCredentials.email, tempCredentials.password);
        
        if (inviteToken) {
          await mobileCardService.redeemInvitation(inviteToken);
        }

        reset();
        router.push('/app');
      }
    } catch {
      setErrorMessage('E-mail verificado, mas erro ao fazer login automático. Por favor, entre manualmente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {inviteToken && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-4 text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">Convite Detectado!</p>
          <p className="text-[10px] text-primary/70">Faça login para resgatar seus pontos automaticamente.</p>
        </div>
      )}
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

      <div className="flex justify-end">
        <Link 
          href="/forgot-password" 
          className="text-sm font-medium text-primary hover:underline transition-colors"
        >
          Esqueceu sua senha?
        </Link>
      </div>

      {/* Mensagem de erro */}
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-3 border border-red-200">
          <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Botão de login */}
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg rounded-xl"
        isLoading={isSubmitting}
      >
        Entrar
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-gray-500">Ou entre com</span>
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
                
                // Verifica se é novo usuário para decidir redirecionamento
                const userJson = localStorage.getItem('user');
                if (userJson) {
                  const userData = JSON.parse(userJson);
                  if (userData.isNewUser) {
                    router.push(`/app/register${inviteToken ? `?inviteToken=${inviteToken}` : ''}`);
                    return;
                  }
                }

                router.push('/app');
              } catch (error) {
                setErrorMessage(getFriendlyErrorMessage(error, 'Erro ao entrar com Google.'));
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
          text="signin_with"
          shape="rectangular"
        />
      </div>

      {/* Link para registro */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Não tem uma conta?{' '}
        <Link 
          href={`/app/register${inviteToken ? `?inviteToken=${inviteToken}` : ''}`} 
          className="text-primary hover:underline font-semibold transition-all"
        >
          Criar conta de cliente
        </Link>
      </p>

      {showEmailVerificationModal && (
        <EmailVerificationModal
          email={userEmail}
          onSuccess={handleEmailVerificationSuccess}
          onCancel={() => setShowEmailVerificationModal(false)}
        />
      )}
    </form>
  );
};
