/**
 * Página de login
 */

'use client';

import React, { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

function LoginContent() {
  const searchParams = useSearchParams();
  const isAccountDeleted = searchParams.get('deleted') === 'true';

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
        <CardDescription className="text-base">
          Acesse sua conta para gerenciar suas campanhas de selos
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {isAccountDeleted && (
          <div className="mb-6 rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Sua conta foi marcada para deleção. Você tem 30 dias para reativar sua conta ao fazer login.
            </p>
          </div>
        )}
        <LoginForm />
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Coluna da Esquerda: Formulário */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <Image src="/fidd.png" alt="FIDD Logo" width={64} height={64} className="mb-2 dark:brightness-110" />
            <h1 className="text-4xl font-black tracking-tighter text-primary">FIDD</h1>
          </div>

          <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-xl" />}>
            <LoginContent />
          </Suspense>

          <p className="text-center text-xs text-muted-foreground">
            Ao entrar, você concorda com nossos{' '}
            <Link href="/terms" className="hover:text-primary underline transition-colors">
              Termos de Serviço
            </Link>
            {' '}e{' '}
            <a href="https://tonima.digital/fidd-policy.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline transition-colors">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>

      {/* Coluna da Direita: Branding/Visual (Oculto em Mobile) */}
      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        
        <div className="relative z-10 text-center text-primary-foreground max-w-lg flex flex-col items-center">
          <Image src="/fidd.png" alt="FIDD Logo" width={100} height={100} className="mb-6" />
          <h1 className="text-6xl font-black tracking-tighter mb-6">FIDD</h1>
          <h2 className="text-3xl font-bold mb-4">Fidelize seus clientes com simplicidade.</h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            Crie cartões de selos virtuais, acompanhe o engajamento e aumente o faturamento da sua loja com uma plataforma intuitiva e moderna.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-6 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="font-bold text-xl mb-1">+150%</div>
              <div className="text-sm opacity-80">Retenção de clientes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="font-bold text-xl mb-1">Simples</div>
              <div className="text-sm opacity-80">Configuração em 5 min</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
