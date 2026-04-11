/**
 * Página de registro
 */

import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Criar Conta - FIDD",
  description: "Registre sua loja no sistema FIDD e comece a fidelizar seus clientes hoje mesmo.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card de registro */}
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          {/* Header */}
          <div className="text-center mb-8 flex flex-col items-center">
            <Image src="/fidd.png" alt="FIDD Logo" width={48} height={48} className="mb-2 dark:brightness-110" />
            <h1 className="text-3xl font-bold text-foreground">FIDD</h1>
            <p className="text-muted-foreground text-sm mt-2 font-medium tracking-tight">Cartões de Fidelidade Virtuais</p>
          </div>

          {/* Título */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Criar Conta</h2>
            <p className="text-muted-foreground text-sm mt-1">Registre sua loja no sistema FIDD</p>
          </div>

          {/* Formulário */}
          <RegisterForm />

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground border-t border-border pt-6">
            <p className="leading-relaxed">
              Ao se registrar, você concorda com nossos{' '}
              <Link href="/terms" className="text-primary hover:underline font-medium">
                Termos de Serviço
              </Link>
              {' '}e{' '}
              <a href="https://tonima.digital/fidd-policy.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>

        {/* Link de suporte */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm">
            Precisa de ajuda?{' '}
            <a href="mailto:suporte@fidd.com.br" className="text-primary hover:underline font-medium transition-colors">
              Fale com nosso suporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
