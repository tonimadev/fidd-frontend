/**
 * Página de registro para o cliente
 */

'use client';

import React, { Suspense } from 'react';
import { MobileRegisterForm } from '@/components/auth/MobileRegisterForm';
import Image from 'next/image';

function RegisterForm() {
  return <MobileRegisterForm />;
}

export default function MobileRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8 my-8">
        <div className="flex flex-col items-center mb-6">
          <Image src="/fidd.png" alt="FIDD Logo" width={60} height={60} className="mb-2 dark:brightness-110" />
          <h1 className="text-3xl font-black tracking-tighter text-primary">FIDD</h1>
          <p className="text-muted-foreground text-center mt-1">
            Crie sua conta de cliente
          </p>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
          <Suspense fallback={<div className="h-64 animate-pulse bg-slate-100 rounded-xl" />}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
