'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { publicService, PublicStore } from '@/lib/public-service';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Star, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PublicStorePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const refId = searchParams.get('ref');

  const [store, setStore] = useState<PublicStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setIsLoading(true);
        const data = await publicService.getStoreBySlug(slug);
        setStore(data);
      } catch (err) {
        console.error(err);
        setError('Loja não encontrada ou link inválido.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchStore();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" size={48} />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-black text-slate-800">Ops! Algo deu errado.</h1>
          <p className="text-slate-600">{error || 'Não conseguimos encontrar esta loja.'}</p>
          <Button asChild className="w-full">
            <Link href="/">Voltar para a Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const highlightColor = store.highlightColor || '#3b82f6';
  const registerUrl = `/app?store=${store.slug}${refId ? `&ref=${refId}` : ''}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header / Brand */}
      <header className="bg-white border-b border-slate-100 py-12 px-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-6">
          {store.logoUrl ? (
            <img 
              src={store.logoUrl} 
              alt={store.name} 
              className="w-24 h-24 rounded-3xl shadow-xl border-4 border-white object-cover"
            />
          ) : (
            <div 
              className="w-24 h-24 rounded-3xl shadow-xl border-4 border-white flex items-center justify-center text-white text-4xl font-black"
              style={{ backgroundColor: highlightColor }}
            >
              {store.name.charAt(0)}
            </div>
          )}
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {store.name}
            </h1>
            {store.description && (
              <p className="text-slate-600 max-w-sm mx-auto leading-relaxed">
                {store.description}
              </p>
            )}
          </div>
          
          <Button asChild size="lg" className="px-12 font-black rounded-full shadow-lg" style={{ backgroundColor: highlightColor }}>
            <Link href={registerUrl}>COMEÇAR A GANHAR SELOS</Link>
          </Button>
        </div>
      </header>

      {/* Campaigns */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-6 space-y-8 pb-12">
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Star size={20} style={{ color: highlightColor }} />
            Campanhas Ativas
          </h2>
          
          {store.activeCampaigns.length > 0 ? (
            <div className="grid gap-6">
              {store.activeCampaigns.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden border-none shadow-md">
                  {campaign.imageUrl && (
                    <img src={campaign.imageUrl} alt={campaign.name} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-800">{campaign.name}</h3>
                      {campaign.description && (
                        <p className="text-sm text-slate-500">{campaign.description}</p>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Prêmios disponíveis</p>
                      <div className="space-y-2">
                        {campaign.rewards.map((reward, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm font-bold p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-700">{reward.name}</span>
                            <span className="text-primary" style={{ color: highlightColor }}>{reward.pointsRequired} selos</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {campaign.expirationDate && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                        <Calendar size={14} />
                        Válido até {new Date(campaign.expirationDate).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center py-12 text-slate-400 font-medium italic">
              Nenhuma campanha ativa no momento.
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
          Powered by <span className="text-slate-800 font-black">FIDD</span>
        </p>
      </footer>
    </div>
  );
}
