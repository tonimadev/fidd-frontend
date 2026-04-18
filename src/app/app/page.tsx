/**
 * Dashboard do cliente (mobile web)
 */

'use client';

import React, { useEffect, useState } from 'react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { useMobileAuth } from '@/context/mobile-auth-context';
import { mobileCardService } from '@/lib/mobile-card-service';
import { mobileStoreService } from '@/lib/mobile-store-service';
import { MobileCardResponse } from '@/types/mobile-cards';
import { MobileStoreNearbyResponse } from '@/types/mobile-stores';
import { MobileCard } from '@/components/mobile/MobileCard';
import { MobileStore } from '@/components/mobile/MobileStore';
import { DownloadButtons } from '@/components/mobile/DownloadButtons';
import { AlertCircle, PlusCircle, PartyPopper, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CustomerDashboard() {
  const { user } = useMobileAuth();
  const [cards, setCards] = useState<MobileCardResponse[]>([]);
  const [stores, setStores] = useState<MobileStoreNearbyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRetroactiveAlert, setShowRetroactiveAlert] = useState(false);

  const [locationName, setLocationName] = useState('Localizando...');

  useEffect(() => {
    if (user?.linkedPunchesCount && user.linkedPunchesCount > 0) {
      setShowRetroactiveAlert(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Tentar obter a localização real
        let lat = -23.5505; // Fallback: São Paulo
        let lng = -46.6333;
        
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: true
            });
          });
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          setLocationName('Sua Localização');
        } catch (geoErr) {
          console.warn('Erro ao obter geolocalização, usando fallback:', geoErr);
          setLocationName('São Paulo, SP');
        }
        
        // Em paralelo para ser mais rápido
        const [cardsData, storesData] = await Promise.allSettled([
          mobileCardService.getCards(),
          mobileStoreService.getNearbyStores(lat, lng)
        ]);

        if (cardsData.status === 'fulfilled') {
          setCards(cardsData.value);
        } else {
          console.error('Erro ao buscar cartões:', cardsData.reason);
          setError('Não foi possível carregar seus cartões.');
        }

        if (storesData.status === 'fulfilled') {
          setStores(storesData.value);
        }

      } catch (err) {
        console.error('Erro geral:', err);
        setError('Ocorreu um erro ao carregar os dados.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeCards = cards.filter(c => c.status === 'IN_PROGRESS' || c.status === 'COMPLETED');
  const historyCards = cards.filter(c => c.status === 'REDEEMED' || c.status === 'EXPIRED');

  return (
    <MobileLayout>
      <div className="px-6 py-6 space-y-8">
        {/* Retroactive Points Alert */}
        {showRetroactiveAlert && user?.linkedPunchesCount && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 relative animate-in fade-in slide-in-from-top-4 duration-500">
            <button 
              onClick={() => setShowRetroactiveAlert(false)}
              className="absolute top-2 right-2 p-1 text-amber-500 hover:text-amber-700 transition-colors"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-xl">
                <PartyPopper className="text-amber-600" size={24} />
              </div>
              <div className="pr-6">
                <h4 className="font-black text-amber-900 text-sm uppercase tracking-tight">Pontos Recuperados!</h4>
                <p className="text-xs text-amber-800 font-medium">
                  Parabéns! Encontramos <span className="font-black text-amber-900">{user.linkedPunchesCount}</span> {user.linkedPunchesCount === 1 ? 'carimbo' : 'carimbos'} anteriores vinculados ao seu e-mail!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-primary p-6 rounded-[2rem] text-white shadow-xl shadow-primary/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <span className="text-2xl font-bold uppercase">{user?.name?.charAt(0)}</span>
            </div>
            <div>
              <p className="text-primary-foreground/80 text-sm font-bold uppercase tracking-widest">Bem-vindo(a)</p>
              <h2 className="text-2xl font-black tracking-tight">{user?.name}</h2>
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 flex justify-between items-center backdrop-blur-sm border border-white/10">
            <div>
              <p className="text-xs font-bold uppercase opacity-70 tracking-tighter">Cartões Ativos</p>
              <p className="text-2xl font-black">{activeCards.length}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase opacity-70 tracking-tighter">Concluídos</p>
              <p className="text-2xl font-black">{activeCards.filter(c => c.status === 'COMPLETED').length}</p>
            </div>
          </div>
          
          {/* NFC Tip */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-3">
            <div className="bg-white/20 p-1.5 rounded-lg shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-tight opacity-90 leading-tight">
              Dica: Você pode ganhar selos apenas aproximando seu celular do dispositivo do lojista!
            </p>
          </div>
        </div>

        {/* Nearby Stores */}
        <section id="stores">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-black tracking-tight uppercase italic text-slate-800">Lojas Próximas</h3>
            <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full uppercase">{locationName}</span>
          </div>
          
          {isLoading ? (
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
              {[1, 2].map(i => (
                <div key={i} className="min-w-[280px] h-24 bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : stores.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
              {stores.map(store => (
                <MobileStore key={store.id} store={store} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-100 p-6 rounded-2xl border border-dashed border-slate-300 text-center">
              <p className="text-sm text-slate-500 font-medium">Nenhuma loja encontrada na sua região.</p>
            </div>
          )}
        </section>

        {/* Cards Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-black tracking-tight uppercase italic text-slate-800">Meus Cartões</h3>
            <Button variant="ghost" size="sm" className="text-primary font-bold uppercase text-xs">Ver todos</Button>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col items-center gap-3">
              <AlertCircle className="text-red-500" size={32} />
              <p className="text-red-700 font-bold text-center">{error}</p>
              <Button onClick={() => window.location.reload()} size="sm" variant="outline" className="border-red-200 text-red-600">Tentar novamente</Button>
            </div>
          ) : activeCards.length > 0 ? (
            <div className="space-y-6">
              {activeCards.map(card => (
                <MobileCard key={card.id} card={card} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[2rem] border border-dashed border-slate-300 flex flex-col items-center gap-4 text-center">
              <div className="bg-slate-50 p-4 rounded-full">
                <PlusCircle size={48} className="text-slate-300" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800">Nenhum cartão ativo</h4>
                <p className="text-sm text-slate-500">Visite uma loja parceira e peça seu cartão FIDD!</p>
              </div>
              <Button className="rounded-xl px-8 uppercase font-black tracking-widest text-xs">Descobrir Lojas</Button>
            </div>
          )}
        </section>

        {/* History Section */}
        {historyCards.length > 0 && (
          <section className="pb-8">
            <h3 className="text-sm font-black tracking-widest uppercase text-slate-400 mb-4">Histórico</h3>
            <div className="space-y-4 opacity-60 grayscale">
              {historyCards.map(card => (
                <MobileCard key={card.id} card={card} />
              ))}
            </div>
          </section>
        )}

        {/* Download App Section */}
        <section className="pb-4">
          <DownloadButtons />
        </section>
      </div>
    </MobileLayout>
  );
}
