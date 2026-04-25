'use client';

import React from 'react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { TransactionHistoryFeed } from '@/components/mobile/TransactionHistoryFeed';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const router = useRouter();

  return (
    <MobileLayout>
      <div className="px-6 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="text-slate-600" size={20} />
          </button>
          <h2 className="text-2xl font-black tracking-tight uppercase italic text-slate-800">
            Meu Histórico
          </h2>
        </div>
        
        <p className="text-slate-500 text-sm">
          Acompanhe todos os selos que você coletou nas lojas parceiras.
        </p>

        <TransactionHistoryFeed summary={false} />
      </div>
    </MobileLayout>
  );
}
