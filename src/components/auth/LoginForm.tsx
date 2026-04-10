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
import axios from 'axios';
import { LoginRequest } from '@/types/auth';
import { GoogleLogin } from '@react-oauth/google';
import { trackEvent } from '@/lib/firebase';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState<LoginRequest | undefined>();

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

      trackEvent('login', { method: 'email' });

      // Verifica se a conta está marcada para deleção (Cenário onde o login ainda funciona)
      try {
        const deleteStatus = await accountService.getDeleteStatus();
        if (deleteStatus.status === 'PENDING_DELETION') {
          setLoginCredentials({ email: data.email, password: data.password });
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
      trackEvent('login_failed', { method: 'email', error_type: 'bad_credentials' });
      // Cenário B: API retorna 400 se a conta estiver em processo de exclusão
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const apiMessage = error.response.data?.message || '';
        if (
          apiMessage === 'account.deletion.pending.login' || 
          apiMessage.toLowerCase().includes('exclusão')
        ) {
          setLoginCredentials({ email: data.email, password: data.password });
          setShowReactivateModal(true);
          return;
        }
      }
      
      setErrorMessage(getFriendlyErrorMessage(error, 'Erro ao fazer login. Tente novamente.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactivateSuccess = async () => {
    setShowReactivateModal(false);
    trackEvent('account_reactivation', { status: 'success' });

    // Após reativar, precisamos logar novamente se ainda não estivermos logados
    // ou simplesmente redirecionar se já tivermos o token
    try {
      if (loginCredentials) {
        setIsSubmitting(true);
        await login(loginCredentials.email, loginCredentials.password);
      }
      reset();
      router.push('/dashboard');
    } catch {
      setErrorMessage('Conta reativada, mas erro ao fazer login automático. Por favor, entre manualmente.');
    } finally {
      setIsSubmitting(false);
    }
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

      <div className="flex justify-end">
        <Link 
          href="/forgot-password" 
          className="text-sm font-medium text-primary hover:underline transition-colors"
          onClick={() => trackEvent('forgot_password_click')}
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
        className="w-full"
        isLoading={isSubmitting}
      >
        Entrar
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Ou entre com</span>
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
                trackEvent('login', { method: 'google' });
                router.push('/dashboard');
              } catch (error) {
                trackEvent('login_failed', { method: 'google' });
                setErrorMessage(getFriendlyErrorMessage(error, 'Erro ao entrar com Google.'));
              } finally {
                setIsSubmitting(false);
              }
            }
          }}
          onError={() => {
            trackEvent('login_failed', { method: 'google', error_type: 'popup_closed' });
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
          href="/register"
          className="text-primary hover:underline font-semibold transition-all"
          onClick={() => trackEvent('navigate_to_register')}
        >
          Criar conta
        </Link>
      </p>

      {/* Modal de Reativação */}
      {showReactivateModal && (
        <ReactivateAccountModal
          onSuccess={handleReactivateSuccess}
          onCancel={handleReactivateCancel}
          credentials={loginCredentials}
        />
      )}
    </form>
  );
};
