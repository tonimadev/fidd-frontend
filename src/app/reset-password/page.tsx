/**
 * Página de redefinição de senha
 */

'use client';

import React, { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="rounded-full bg-red-100 p-3 w-16 h-16 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Link inválido</h3>
          <p className="text-muted-foreground">
            O link de redefinição de senha está incompleto ou é inválido. Por favor, verifique seu e-mail novamente.
          </p>
        </div>
        <Link href="/forgot-password" title="Recuperar senha" className="block">
          <button className="w-full text-sm font-semibold text-primary hover:underline">
            Solicitar novo link
          </button>
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center mb-8">
          <Link href="/login" className="flex flex-col items-center">
            <Image src="/fidd.png" alt="FIDD Logo" width={64} height={64} className="mb-2 dark:brightness-110" />
            <h1 className="text-4xl font-black tracking-tighter text-primary">FIDD</h1>
          </Link>
        </div>

        <Card className="border shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Nova Senha</CardTitle>
            <CardDescription className="text-base">
              Crie uma senha segura para o seu próximo acesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-48 animate-pulse bg-muted rounded-xl" />}>
              <ResetPasswordContent />
            </Suspense>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FIDD. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
