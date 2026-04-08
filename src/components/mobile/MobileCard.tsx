/**
 * Componente de cartão para o cliente (mobile)
 */

'use client';

import React from 'react';
import { MobileCardResponse } from '@/types/mobile-cards';
import { Card, CardContent } from '@/components/ui/Card';
import { Store, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface MobileCardProps {
  card: MobileCardResponse;
}

export const MobileCard: React.FC<MobileCardProps> = ({ card }) => {
  const isCompleted = card.status === 'COMPLETED';
  const progressPercent = Math.min(100, (card.currentPoints / card.pointsRequired) * 100);

  return (
    <Link href={`/app/cards/${card.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-primary/10 hover:border-primary/30 active:scale-[0.98] shadow-sm">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Store size={16} />
              <span className="text-sm uppercase tracking-wider">{card.storeName}</span>
            </div>
            {isCompleted && (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-tighter">
                <CheckCircle2 size={10} />
                Pronto para resgate
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-extrabold leading-tight mb-3">
            {card.campaignName}
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              <span>{card.currentPoints} / {card.pointsRequired} Pontos</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-3 bg-secondary/30 rounded-full overflow-hidden border border-border/50">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
