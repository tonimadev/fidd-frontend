/**
 * Componente de loja próxima para o cliente (mobile)
 */

'use client';

import React from 'react';
import { MobileStoreNearbyResponse } from '@/types/mobile-stores';
import { Card, CardContent } from '@/components/ui/Card';
import { Store, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MobileStoreProps {
  store: MobileStoreNearbyResponse;
}

export const MobileStore: React.FC<MobileStoreProps> = ({ store }) => {
  const handleRouteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (store.latitude && store.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`, '_blank');
    }
  };

  return (
    <Card className="min-w-[280px] border-secondary/10 shadow-none bg-secondary/10">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-2xl text-primary">
          <Store size={24} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-extrabold text-foreground truncate">{store.tradeName}</h4>
          <p className="text-xs text-muted-foreground truncate">{store.address || 'Sem endereço disponível'}</p>
          {store.distance !== undefined && (
            <span className="text-[10px] font-black text-primary uppercase">
              {store.distance.toFixed(1)} km de distância
            </span>
          )}
        </div>

        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full border-primary/20 hover:bg-primary/10 text-primary"
          onClick={handleRouteClick}
          title="Como chegar"
        >
          <Navigation size={18} />
        </Button>
      </CardContent>
    </Card>
  );
};
