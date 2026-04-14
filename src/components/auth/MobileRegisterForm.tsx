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
import { analyticsService } from '@/lib/analytics';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GoogleLogin } from '@react-oauth/google';
import { EmailVerificationModal } from '@/components/auth/EmailVerificationModal';
import axios from 'axios';

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
};

export const MobileRegisterForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('inviteToken');
  const { register: registerUser, loginWithGoogle, user, login } = useMobileAuth();
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
  } = useForm<MobileRegisterFormData>({
    resolver: zodResolver(mobileRegisterSchema),
    mode: 'onBlur',
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  // Atualiza campos se o usuário autenticar com Google SSO (novo usuário)
  React.useEffect(() => {
    if (user && user.isNewUser) {
      reset({
        name: user.name,
        email: user.email,
        phone: '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: MobileRegisterFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await registerUser(data);
      analyticsService.track('registration', { method: 'email' });
      
      // Resgatar convite se houver token
      if (inviteToken) {
        try {
          await mobileCardService.redeemInvitation(inviteToken);
        } catch (err) {
          console.error('Erro ao resgatar convite após registro:', err);
        }
      }

      // Verifica se o e-mail precisa ser verificado
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const userData = JSON.parse(userJson);
        if (userData.emailVerified === false) {
          setUserEmail(data.email);
          setTempCredentials({ email: data.email, password: data.password });
          setShowEmailVerificationModal(true);
          return;
        }
      }

      reset();
      router.push('/app');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const apiMessage = error.response.data?.message || '';
        const lowerMessage = apiMessage.toLowerCase();
        if (
          apiMessage === 'authentication.email.not.verified' || 
          lowerMessage.includes('e-mail não verificado') ||
          lowerMessage.includes('email não verificado') ||
          lowerMessage.includes('validar o código')
        ) {
           setUserEmail(data.email);
           setTempCredentials({ email: data.email, password: data.password });
           setShowEmailVerificationModal(true);
           return;
        }
      }
      analyticsService.track('registration_failed', { method: 'email', error_type: 'bad_request' });
      setErrorMessage(getFriendlyErrorMessage(error, 'Erro ao criar conta. Tente novamente.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailVerificationSuccess = async () => {
    setShowEmailVerificationModal(false);
    analyticsService.track('email_verification', { status: 'success' });
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
        placeholder="(11) 98888-7777"
        error={errors.phone?.message}
        maxLength={15}
        {...register('phone', {
          onChange: (e) => {
            e.target.value = formatPhone(e.target.value);
          }
        })}
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
                
                // Verifica se é novo usuário para decidir redirecionamento
                const userJson = localStorage.getItem('user');
                if (userJson) {
                  const userData = JSON.parse(userJson);
                  if (!userData.isNewUser) {
                    router.push('/app');
                  }
                  // Se for isNewUser, continua na página de registro para completar os dados
                }
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

      {showEmailVerificationModal && (
        <EmailVerificationModal
          email={userEmail}
          userType="CUSTOMER"
          onSuccess={handleEmailVerificationSuccess}
          onCancel={() => setShowEmailVerificationModal(false)}
        />
      )}
    </form>
  );
};
