/**
 * Componente de formulário de registro
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validations';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import Link from 'next/link';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      taxIdType: 'CNPJ',
    },
  });

  const password = watch('password');
  const taxIdType = watch('taxIdType');
  const taxId = watch('taxId');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await registerUser(data.tradeName, data.taxId, data.email, data.password);
      reset();
      router.push('/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const message = axiosError.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      setErrorMessage(message);
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

    if (score <= 2) return { strength: 'Fraca', color: 'text-red-600' };
    if (score <= 3) return { strength: 'Média', color: 'text-yellow-600' };
    if (score <= 4) return { strength: 'Forte', color: 'text-blue-600' };
    return { strength: 'Muito Forte', color: 'text-green-600' };
  };

  const passwordStrength = getPasswordStrength(password);

  const getDocumentPlaceholder = (): string => {
    return taxIdType === 'CNPJ' ? '12345678000195' : '12345678901';
  };

  const getDocumentLabel = (): string => {
    return taxIdType === 'CNPJ' ? 'CNPJ (14 dígitos)' : 'CPF (11 dígitos)';
  };

  const getDocumentMaxLength = (): number => {
    return taxIdType === 'CNPJ' ? 14 : 11;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nome da Loja */}
      <div>
        <label htmlFor="tradeName" className="block text-sm font-medium text-gray-700">
          Nome da Loja
        </label>
        <input
          {...register('tradeName')}
          type="text"
          id="tradeName"
          placeholder="Padaria do João"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.tradeName && (
          <p className="mt-1 text-sm text-red-600">{errors.tradeName.message}</p>
        )}
      </div>

      {/* Tipo de Documento */}
      <div>
        <label htmlFor="taxIdType" className="block text-sm font-medium text-gray-700">
          Tipo de Documento
        </label>
        <div className="mt-1 flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              {...register('taxIdType')}
              type="radio"
              value="CNPJ"
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">CNPJ (Loja/Empresa)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              {...register('taxIdType')}
              type="radio"
              value="CPF"
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">CPF (Pessoa Física)</span>
          </label>
        </div>
        {errors.taxIdType && (
          <p className="mt-1 text-sm text-red-600">{errors.taxIdType.message}</p>
        )}
      </div>

      {/* Documento (CNPJ ou CPF) */}
      <div>
        <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">
          {getDocumentLabel()}
        </label>
        <input
          {...register('taxId')}
          type="text"
          id="taxId"
          placeholder={getDocumentPlaceholder()}
          maxLength={getDocumentMaxLength()}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {taxId && (
          <p className="mt-1 text-xs text-gray-500">
            {taxId.length}/{getDocumentMaxLength()} dígitos
          </p>
        )}
        {errors.taxId && (
          <p className="mt-1 text-sm text-red-600">{errors.taxId.message}</p>
        )}
      </div>

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
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="••••••••"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
          >
            {showPassword ? '👁' : '👁‍🗨'}
          </button>
        </div>

        {/* Requisitos de senha */}
        <div className="mt-2 space-y-1 text-xs">
          <p className={password?.length >= 8 ? 'text-green-600' : 'text-gray-600'}>
            ✓ Mínimo 8 caracteres
          </p>
          <p className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-600'}>
            ✓ Pelo menos uma letra minúscula
          </p>
          <p className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-600'}>
            ✓ Pelo menos uma letra maiúscula
          </p>
          <p className={/\d/.test(password) ? 'text-green-600' : 'text-gray-600'}>
            ✓ Pelo menos um número
          </p>
          <p className={/@$!%*?&/.test(password) ? 'text-green-600' : 'text-gray-600'}>
            ✓ Pelo menos um caractere especial (@$!%*?&)
          </p>
        </div>

        {password && (
          <p className={`mt-2 text-sm font-medium ${passwordStrength.color}`}>
            Força da senha: {passwordStrength.strength}
          </p>
        )}

        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Confirmar Senha */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirmar Senha
        </label>
        <input
          {...register('confirmPassword')}
          type="password"
          id="confirmPassword"
          placeholder="••••••••"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Mensagem de erro */}
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Botão de registro */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
      </button>

      {/* Link para login */}
      <p className="text-center text-sm text-gray-600">
        Já tem uma conta?{' '}
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Fazer login
        </Link>
      </p>
    </form>
  );
};

