'use client';

import React, { useEffect } from 'react';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from '@/components/ui/Card';
import { RefreshCcw, CheckCircle2, History } from 'lucide-react';

interface TransactionHistoryFeedProps {
  summary?: boolean;
}

export function TransactionHistoryFeed({ summary = false }: TransactionHistoryFeedProps) {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useTransactionHistory(summary ? 3 : 10);

  useEffect(() => {
    if (!summary && inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, summary]);

  if (status === 'pending') {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3">
        <p className="text-red-700 font-bold text-sm">Erro ao carregar histórico.</p>
      </div>
    );
  }

  const allTransactions = data.pages.flatMap((page) => page.data);

  if (allTransactions.length === 0) {
    return (
      <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 text-center flex flex-col items-center gap-2">
        <History className="text-slate-300" size={32} />
        <p className="text-sm text-slate-500 font-medium">Você ainda não possui histórico de carimbos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allTransactions.map((punch) => (
        <Card key={punch.id} className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-emerald-100 p-2.5 rounded-full shrink-0">
              <CheckCircle2 className="text-emerald-600" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm truncate">{punch.storeName}</p>
              <p className="text-xs text-slate-500 truncate">{punch.campaignName}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-emerald-600 font-black text-sm">+1 Selo</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                {new Date(punch.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      {!summary && (
        <div ref={ref} className="py-4 flex justify-center">
          {isFetchingNextPage ? (
            <RefreshCcw className="animate-spin text-slate-400" size={20} />
          ) : hasNextPage ? (
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Carregando mais...</span>
          ) : (
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Fim do Histórico</span>
          )}
        </div>
      )}
      
      {summary && hasNextPage && (
        <div className="pt-2 text-center">
          <a href="/app/history" className="text-xs font-bold text-primary uppercase tracking-widest">
            Ver Todo o Histórico
          </a>
        </div>
      )}
    </div>
  );
}
