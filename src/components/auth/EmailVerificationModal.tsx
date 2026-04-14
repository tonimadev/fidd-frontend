/**
 * Modal para verificação de e-mail via código OTA
 */

'use client';

import React, { useState, useEffect } from 'react';
import { authService } from '@/lib/auth-service';
import { analyticsService } from '@/lib/analytics';
import { AxiosError } from 'axios';

interface EmailVerificationModalProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  email,
  onSuccess,
  onCancel,
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setErrorMessage('O código deve ter 6 dígitos.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      await authService.verifyEmail(email, code);
      analyticsService.track('email_verification', { status: 'success' });
      setSuccessMessage('E-mail verificado com sucesso!');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      analyticsService.track('email_verification', { status: 'failed' });
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message === 'validation.invalid.verification.code'
        ? 'Código inválido. Verifique e tente novamente.'
        : axiosError.response?.data?.message === 'validation.verification.code.expired'
        ? 'Código expirado. Solicite um novo código.'
        : 'Erro ao verificar e-mail. Tente novamente.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      setErrorMessage('');
      await authService.requestEmailCode(email);
      setSuccessMessage('Novo código enviado para seu e-mail!');
      setTimer(60);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setErrorMessage('Erro ao reenviar código. Tente novamente em alguns instantes.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-blue-100 p-3 text-blue-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Verifique seu e-mail</h3>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Enviamos um código de 6 dígitos para <strong>{email}</strong>. 
            Por favor, insira o código abaixo para ativar sua conta.
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-8">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full text-center text-3xl font-bold tracking-[0.5em] py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all mb-4"
            disabled={isLoading}
          />

          {errorMessage && (
            <div className="mb-4 rounded-xl bg-red-50 p-4 border border-red-100">
              <p className="text-sm text-red-700 font-medium text-center">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-xl bg-green-50 p-4 border border-green-100 flex items-center justify-center gap-3">
              <p className="text-sm text-green-700 font-bold">{successMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full rounded-xl bg-primary px-6 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-400 disabled:scale-100 disabled:shadow-none"
          >
            {isLoading ? 'Verificando...' : 'Confirmar Código'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4">
          <button
            onClick={handleResend}
            disabled={isResending || timer > 0}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
          >
            {timer > 0 ? `Reenviar código em ${timer}s` : 'Não recebeu o código? Reenviar'}
          </button>
          
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    </div>
  );
};
