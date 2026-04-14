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
import { EmailVerificationModal } from '@/components/auth/EmailVerificationModal';
import { accountService } from '@/lib/account-service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import axios from 'axios';
import { LoginRequest } from '@/types/auth';
import { GoogleLogin } from '@react-oauth/google';
import { analyticsService } from '@/lib/analytics';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
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
      analyticsService.track('login', { method: 'email' });

      // Verifica se o e-mail precisa ser verificado
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const userData = JSON.parse(userJson);
        if (userData.emailVerified === false) {
          setUserEmail(data.email);
          setLoginCredentials({ email: data.email, password: data.password });
          setShowEmailVerificationModal(true);
          setIsSubmitting(false);
          return;
        }
      }

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
      
      // Redirecionar baseado na role
      const userJsonAfterLogin = localStorage.getItem('user');
      if (userJsonAfterLogin) {
        const userData = JSON.parse(userJsonAfterLogin);
        if (userData.role === 'ADMIN') {
          router.push('/admin/dashboard');
          return;
        }
      }

      router.push('/dashboard');
    } catch (error) {
      analyticsService.track('login_failed', { method: 'email', error_type: 'bad_credentials' });
      // Cenário B: API retorna 400 se a conta estiver em processo de exclusão ou e-mail não verificado
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const apiMessage = error.response.data?.message || '';
        
        // Conta em exclusão
        if (
          apiMessage === 'account.deletion.pending.login' || 
          apiMessage.toLowerCase().includes('exclusão')
        ) {
          setLoginCredentials({ email: data.email, password: data.password });
          setShowReactivateModal(true);
          return;
        }

        // E-mail não verificado
        if (
          apiMessage === 'authentication.email.not.verified' ||
          apiMessage.toLowerCase().includes('e-mail não verificado')
        ) {
          setUserEmail(data.email);
          setLoginCredentials({ email: data.email, password: data.password });
          setShowEmailVerificationModal(true);
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
    analyticsService.track('account_reactivation', { status: 'success' });

    // Após reativar, precisamos logar novamente se ainda não estivermos logados
    // ou simplesmente redirecionar se já tivermos o token
    try {
      if (loginCredentials) {
        setIsSubmitting(true);
        await login(loginCredentials.email, loginCredentials.password);
      }
      reset();
      
      // Redirecionar baseado na role
      const userJsonAfterReactivate = localStorage.getItem('user');
      if (userJsonAfterReactivate) {
        const userData = JSON.parse(userJsonAfterReactivate);
        if (userData.role === 'ADMIN') {
          router.push('/admin/dashboard');
          return;
        }
      }

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

  const handleEmailVerificationSuccess = async () => {
    setShowEmailVerificationModal(false);
    analyticsService.track('email_verification', { status: 'success' });

    try {
      if (loginCredentials) {
        setIsSubmitting(true);
        await login(loginCredentials.email, loginCredentials.password);
        reset();
        
        // Redirecionar baseado na role
        const userJsonAfterVerify = localStorage.getItem('user');
        if (userJsonAfterVerify) {
          const userData = JSON.parse(userJsonAfterVerify);
          if (userData.role === 'ADMIN') {
            router.push('/admin/dashboard');
            return;
          }
        }

        router.push('/dashboard');
      }
    } catch {
      setErrorMessage('E-mail verificado, mas erro ao fazer login automático. Por favor, entre manualmente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailVerificationCancel = () => {
    setShowEmailVerificationModal(false);
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
          onClick={() => analyticsService.track('forgot_password_click')}
        >
          Esqueceu sua senha?
        </Link>
      </div>

      {/* Mensagem de erro */}
      {errorMessage && (
        <div className="rounded-lg bg-red-500/10 p-3 border border-red-500/20">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{errorMessage}</p>
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
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Ou entre com</span>
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
                analyticsService.track('login', { method: 'google' });
                
                // Get user from localStorage to check if new user
                const userJson = localStorage.getItem('user');
                if (userJson) {
                  const userData = JSON.parse(userJson);
                  if (userData.isNewUser) {
                    router.push('/register');
                    return;
                  }

                  // Redirecionar baseado na role
                  if (userData.role === 'ADMIN') {
                    router.push('/admin/dashboard');
                    return;
                  }
                }
                
                router.push('/dashboard');
              } catch (error) {
                analyticsService.track('login_failed', { method: 'google' });
                setErrorMessage(getFriendlyErrorMessage(error, 'Erro ao entrar com Google.'));
              } finally {
                setIsSubmitting(false);
              }
            }
          }}
          onError={() => {
            analyticsService.track('login_failed', { method: 'google', error_type: 'popup_closed' });
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
          onClick={() => analyticsService.track('navigate_to_register')}
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

      {showEmailVerificationModal && (
        <EmailVerificationModal
          email={userEmail}
          userType="STORE"
          onSuccess={handleEmailVerificationSuccess}
          onCancel={handleEmailVerificationCancel}
        />
      )}
    </form>
  );
};
