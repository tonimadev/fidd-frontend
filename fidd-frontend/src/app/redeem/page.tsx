'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RedeemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Redireciona para a página de login/registro do cliente com o token
      router.replace(`/app/login?inviteToken=${token}`);
    } else {
      router.replace('/app');
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Redirecionando para o resgate...</p>
      </div>
    </div>
  );
}

export default function RedeemPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    }>
      <RedeemContent />
    </Suspense>
  );
}
