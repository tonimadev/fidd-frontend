/**
 * Página de login
 */

'use client';

import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const isAccountDeleted = searchParams.get('deleted') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Mensagem de sucesso de deleção */}
        {isAccountDeleted && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-green-700">
              Sua conta foi marcada para deleção. Você tem 30 dias para reativar sua conta ao fazer login.
            </p>
          </div>
        )}

        {/* Card de login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">FIDD</h1>
            <p className="text-gray-600 text-sm mt-2">Cartões de Fidelidade Virtuais</p>
          </div>

          {/* Título */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Bem-vindo</h2>
            <p className="text-gray-600 text-sm mt-1">Faça login na sua conta de loja</p>
          </div>

          {/* Formulário */}
          <LoginForm />

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500 border-t pt-6">
            <p>
              Ao fazer login, você concorda com nossos{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Termos de Serviço
              </Link>
              {' '}e{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>

        {/* Link de suporte */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Precisa de ajuda?{' '}
            <Link href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
              Contacte-nos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

