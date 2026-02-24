/**
 * Página de registro
 */

import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card de registro */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">FIDD</h1>
            <p className="text-gray-600 text-sm mt-2">Cartões de Fidelidade Virtuais</p>
          </div>

          {/* Título */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Criar Conta</h2>
            <p className="text-gray-600 text-sm mt-1">Registre sua loja no sistema FIDD</p>
          </div>

          {/* Formulário */}
          <RegisterForm />

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500 border-t pt-6">
            <p>
              Ao se registrar, você concorda com nossos{' '}
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

