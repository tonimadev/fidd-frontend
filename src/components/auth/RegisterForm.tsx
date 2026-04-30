/**
 * Componente de formulário de registro — Enhanced with Trust & Conversion
 *
 * 🧠 Psychological Principle: Cognitive Load Theory + Zero Risk Bias
 * Reducing cognitive effort increases completion rates. Trust badges
 * and "sem compromisso" messaging near the CTA reduce perceived risk.
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validations';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { getFriendlyErrorMessage } from '@/lib/error-handler';
import { analyticsService } from '@/lib/analytics';
import { storage } from '@/lib/storage';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff, CreditCard, Clock, ShieldCheck, Users } from 'lucide-react';
import { EmailVerificationModal } from '@/components/auth/EmailVerificationModal';
import axios from 'axios';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { register: registerUser, loginWithGoogle, user, login } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [tempCredentials, setTempCredentials] = useState<{email: string, password: string} | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      taxIdType: 'CNPJ',
      tradeName: user?.tradeName || '',
      email: user?.email || '',
    },
  });


  // Atualiza campos se o usuário autenticar com Google SSO (novo usuário)
  React.useEffect(() => {
    if (user && user.isNewUser) {
      reset({
        tradeName: user.tradeName,
        email: user.email,
        taxIdType: watch('taxIdType') || 'CNPJ',
        taxId: watch('taxId') || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, reset]); // eslint-disable-line react-hooks/exhaustive-deps

  const password = watch('password');
  const taxIdType = watch('taxIdType');
  const taxId = watch('taxId');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await registerUser(data.tradeName, data.taxId, data.email, data.password, data.description);
      analyticsService.track('registration', { method: 'email' });
      
      // Verifica se o e-mail precisa ser verificado
      const userJson = storage.getItem('user');
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
      router.push('/dashboard');
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

    // Atualiza o status de verificação no storage local para evitar re-abertura do modal por useEffect
    const storedUser = storage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        userData.emailVerified = true;
        storage.setItem('user', JSON.stringify(userData));
      } catch (e) {
        console.error('Erro ao atualizar storage local:', e);
      }
    }

    try {
      if (tempCredentials) {
        setIsSubmitting(true);
        await login(tempCredentials.email, tempCredentials.password);
        reset();
        router.push('/dashboard');
      }
    } catch {
      setErrorMessage('E-mail verificado, mas erro ao fazer login automático. Por favor, entre manualmente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (pwd: string): { strength: string; color: string } => {
    if (!pwd) return { strength: '', color: '' };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/@$!%*?&/.test(pwd)) score++;

    if (score <= 2) return { strength: 'Fraca', color: 'text-red-500' };
    if (score <= 3) return { strength: 'Média', color: 'text-amber-500' };
    if (score <= 4) return { strength: 'Forte', color: 'text-primary' };
    return { strength: 'Muito Forte', color: 'text-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(password || '');

  const getDocumentPlaceholder = (): string => {
    return taxIdType === 'CNPJ' ? '123.456.78/0001-95' : '123.456.789-01';
  };

  const getDocumentLabel = (): string => {
    return taxIdType === 'CNPJ' ? 'CNPJ' : 'CPF';
  };

  const getDocumentMaxLength = (): number => {
    return taxIdType === 'CNPJ' ? 18 : 14;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Nome da Loja */}
      <Input
        label="Nome da Loja"
        id="tradeName"
        placeholder="Padaria do João"
        maxLength={100}
        error={errors.tradeName?.message}
        {...register('tradeName')}
      />

      {/* Tipo de Documento */}
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none text-foreground">
          Tipo de Documento
        </label>
        <div className="flex gap-6 p-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              {...register('taxIdType')}
              type="radio"
              value="CNPJ"
              className="w-4 h-4 accent-primary border-input bg-background text-primary focus:ring-primary"
              onChange={(e) => {
                register('taxIdType').onChange(e);
                setValue('taxId', '');
              }}
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">CNPJ (Loja/Empresa)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              {...register('taxIdType')}
              type="radio"
              value="CPF"
              className="w-4 h-4 accent-primary border-input bg-background text-primary focus:ring-primary"
              onChange={(e) => {
                register('taxIdType').onChange(e);
                setValue('taxId', '');
              }}
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">CPF (Pessoa Física)</span>
          </label>
        </div>
        {errors.taxIdType && (
          <p className="text-xs font-medium text-red-500">{errors.taxIdType.message}</p>
        )}
      </div>

      {/* Documento (CNPJ ou CPF) */}
      <div className="space-y-1">
        <Input
          label={getDocumentLabel()}
          id="taxId"
          placeholder={getDocumentPlaceholder()}
          maxLength={getDocumentMaxLength()}
          error={errors.taxId?.message}
          {...register('taxId')}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (taxIdType === 'CNPJ') {
              value = value
                .replace(/^(\d{2})(\d)/, '$1.$2')
                .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                .replace(/\.(\d{3})(\d)/, '.$1/$2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .slice(0, 18);
            } else {
              value = value
                .replace(/^(\d{3})(\d)/, '$1.$2')
                .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
                .replace(/\.(\d{3})(\d)/, '.$1-$2')
                .slice(0, 14);
            }
            e.target.value = value;
            setValue('taxId', value, { shouldValidate: true });
          }}
        />
        {taxId && !errors.taxId && (
          <p className="text-[10px] text-muted-foreground text-right px-1">
            {taxId.replace(/\D/g, '').length}/{taxIdType === 'CNPJ' ? 14 : 11} dígitos
          </p>
        )}
      </div>

      {/* Email */}
      <Input
        label="Email"
        type="email"
        id="email"
        placeholder="seu@email.com"
        maxLength={255}
        error={errors.email?.message}
        {...register('email')}
      />

      {/* Descrição da Loja */}
      <div className="space-y-1">
        <TextArea
          label="Descrição da Loja (Bio)"
          id="description"
          placeholder="Fale brevemente sobre o seu estabelecimento para seus clientes."
          maxLength={300}
          error={errors.description?.message}
          className="resize-none h-24"
          {...register('description')}
        />
        <p className="text-[10px] text-muted-foreground text-right px-1">
          {watch('description')?.length || 0}/300 caracteres
        </p>
      </div>

      {/* Senha */}
      <div className="space-y-1.5 relative">
        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="••••••••"
            maxLength={100}
            error={errors.password?.message}
            className="pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Requisitos de senha */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 px-1">
          <p className={`text-[10px] flex items-center gap-1 ${password?.length >= 8 ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
            <span>{password?.length >= 8 ? '●' : '○'}</span> Mínimo 8 caracteres
          </p>
          <p className={`text-[10px] flex items-center gap-1 ${/[a-z]/.test(password || '') ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
            <span>{/[a-z]/.test(password || '') ? '●' : '○'}</span> Letra minúscula
          </p>
          <p className={`text-[10px] flex items-center gap-1 ${/[A-Z]/.test(password || '') ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
            <span>{/[A-Z]/.test(password || '') ? '●' : '○'}</span> Letra maiúscula
          </p>
          <p className={`text-[10px] flex items-center gap-1 ${/\d/.test(password || '') ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
            <span>{/\d/.test(password || '') ? '●' : '○'}</span> Pelo menos um número
          </p>
        </div>

        {password && (
          <div className="flex items-center justify-between px-1 mt-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Força:</span>
            <span className={`text-[10px] font-bold ${passwordStrength.color} uppercase`}>
              {passwordStrength.strength}
            </span>
          </div>
        )}
      </div>

      {/* Confirmar Senha */}
      <Input
        label="Confirmar Senha"
        type="password"
        id="confirmPassword"
        placeholder="••••••••"
        maxLength={100}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 py-1">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
          <span>Sem cartão de crédito</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>Setup em 2 min</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Sem compromisso</span>
        </div>
      </div>

      {/* Mensagem de erro */}
      {errorMessage && (
        <div className="rounded-lg bg-red-500/10 p-3 border border-red-500/20">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">{errorMessage}</p>
        </div>
      )}

      {/* Botão de registro */}
      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        Criar Conta
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">Ou use sua conta</span>
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
                const userJson = storage.getItem('user');
                if (userJson) {
                  const userData = JSON.parse(userJson);
                  if (!userData.isNewUser) {
                    router.push('/dashboard');
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

      {/* Social Proof + Link para login */}
      <div className="text-center space-y-2 mt-4">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span><strong className="text-foreground">124</strong> lojistas se cadastraram esta semana</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-primary hover:underline font-semibold transition-all">
            Fazer login
          </Link>
        </p>
      </div>

      {showEmailVerificationModal && (
        <EmailVerificationModal
          email={userEmail}
          userType="STORE"
          onSuccess={handleEmailVerificationSuccess}
          onCancel={() => setShowEmailVerificationModal(false)}
        />
      )}
    </form>
  );
};
