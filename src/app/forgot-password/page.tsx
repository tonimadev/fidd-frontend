/**
 * Página de solicitação de recuperação de senha
 */

import React from 'react';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

export const metadata = {
  title: 'Recuperação de Senha | FIDD',
  description: 'Solicite um link para redefinir sua senha de acesso ao painel FIDD.',
};

export default function ForgotPasswordPage() {
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
            <CardTitle className="text-2xl font-bold tracking-tight">Esqueceu sua senha?</CardTitle>
            <CardDescription className="text-base">
              Não se preocupe, vamos te ajudar a recuperar o acesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FIDD. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
