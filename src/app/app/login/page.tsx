/**
 * Página de login para o cliente
 */

'use client';

import React, { Suspense } from 'react';
import { MobileLoginForm } from '@/components/auth/MobileLoginForm';
import Image from 'next/image';

function LoginForm() {
  return <MobileLoginForm />;
}

export default function MobileLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center mb-8">
          <Image src="/fidd.png" alt="FIDD Logo" width={80} height={80} className="mb-4 dark:brightness-110" />
          <h1 className="text-4xl font-black tracking-tighter text-primary">FIDD</h1>
          <p className="text-muted-foreground text-center mt-2">
            Acesse seus cartões de fidelidade
          </p>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
          <Suspense fallback={<div className="h-48 animate-pulse bg-slate-100 rounded-xl" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
