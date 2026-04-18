'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { publicService, PublicStore } from '@/lib/public-service';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Star,
  Loader2,
  BadgeCheck,
  MapPin,
  Gift,
  ChevronRight,
  Sparkles,
  Navigation,
  Clock,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const VerifiedBadge = () => (
  <BadgeCheck className="text-amber-400 fill-amber-400/20" size={22} />
);

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '59, 130, 246';
}

export default function PublicStorePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
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
          <Button onClick={() => router.push('/')} className="w-full">
            Voltar para a Home
          </Button>
        </div>
      </div>
    );
  }

  const highlightColor = store.highlightColor || '#3b82f6';
  const highlightRgb = hexToRgb(highlightColor);
  const registerUrl = `/app?store=${store.slug}${refId ? `&ref=${refId}` : ''}`;

  const openMaps = () => {
    if (store.latitude && store.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`,
        '_blank'
      );
    } else if (store.address) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`,
        '_blank'
      );
    }
  };

  const hasLocation = store.latitude || store.longitude || store.address;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Header */}
      <header
        className="relative overflow-hidden pt-14 pb-20 px-6"
        style={{
          background: `linear-gradient(135deg, ${highlightColor} 0%, rgba(${highlightRgb}, 0.75) 100%)`,
        }}
      >
        {/* decorative blobs */}
        <div
          className="absolute -top-12 -right-12 w-56 h-56 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: '#fff' }}
        />
        <div
          className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full opacity-15 blur-3xl"
          style={{ backgroundColor: '#fff' }}
        />

        <div className="relative max-w-lg mx-auto flex flex-col items-center text-center space-y-5">
          {/* Logo */}
          {store.logoUrl ? (
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl blur-md opacity-40 bg-black scale-105" />
              <Image
                src={store.logoUrl}
                alt={store.name}
                width={96}
                height={96}
                unoptimized
                className="relative w-24 h-24 rounded-3xl shadow-2xl border-4 border-white/60 object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-3xl shadow-2xl border-4 border-white/60 flex items-center justify-center text-white text-4xl font-black bg-white/20 backdrop-blur-sm">
              {store.name.charAt(0)}
            </div>
          )}

          {/* Name & Badge */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2 drop-shadow-sm">
              {store.name}
              {store.isPro && <VerifiedBadge />}
            </h1>
            {store.description && (
              <p className="text-white/85 max-w-xs mx-auto leading-relaxed text-sm font-medium">
                {store.description}
              </p>
            )}
          </div>

          {/* Address pill */}
          {store.address && (
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white/90 text-xs font-semibold">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate max-w-[220px]">{store.address}</span>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs pt-1">
            <button
              onClick={() => router.push(registerUrl)}
              className="flex-1 flex items-center justify-center gap-2 bg-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-lg active:scale-95 transition-transform"
              style={{ color: highlightColor }}
            >
              <Sparkles size={16} />
              GANHAR SELOS
            </button>
            {hasLocation && (
              <button
                onClick={openMaps}
                className="flex-1 flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm border border-white/40 text-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-md active:scale-95 transition-transform"
              >
                <Navigation size={16} />
                COMO CHEGAR
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Stats strip */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-lg mx-auto flex divide-x divide-slate-100">
          <div className="flex-1 flex flex-col items-center py-4 px-2">
            <span className="text-2xl font-black" style={{ color: highlightColor }}>
              {store.activeCampaigns.length}
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-0.5">Campanhas</span>
          </div>
          <div className="flex-1 flex flex-col items-center py-4 px-2">
            <span className="text-2xl font-black" style={{ color: highlightColor }}>
              {store.activeCampaigns.reduce((acc, c) => acc + c.rewards.length, 0)}
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-0.5">Prêmios</span>
          </div>
          <div className="flex-1 flex flex-col items-center py-4 px-2">
            <span className="text-2xl font-black" style={{ color: highlightColor }}>
              {store.isPro ? '✓' : '—'}
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-0.5">Verificado</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-8 pb-16 space-y-8">
        {/* Como funciona */}
        <section className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Como funciona</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '📲', title: 'Cadastre-se', desc: 'Crie sua conta grátis' },
              { icon: '⭐', title: 'Colete selos', desc: 'A cada compra' },
              { icon: '🎁', title: 'Resgate', desc: 'Troque por prêmios' },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100 space-y-1">
                <span className="text-2xl">{step.icon}</span>
                <p className="font-black text-slate-800 text-xs">{step.title}</p>
                <p className="text-slate-400 text-[11px] leading-tight">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Campaigns */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Star size={18} style={{ color: highlightColor }} />
            Campanhas Ativas
          </h2>

          {store.activeCampaigns.length > 0 ? (
            <div className="grid gap-5">
              {store.activeCampaigns.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden border-none shadow-md rounded-2xl">
                  {campaign.imageUrl && (
                    <div className="relative w-full h-44">
                      <Image
                        src={campaign.imageUrl}
                        alt={campaign.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}
                  <div className="p-5 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-800">{campaign.name}</h3>
                      {campaign.description && (
                        <p className="text-sm text-slate-500 leading-relaxed">{campaign.description}</p>
                      )}
                    </div>

                    {/* Rewards */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                        <Gift size={11} />
                        Prêmios disponíveis
                      </p>
                      <div className="space-y-1.5">
                        {campaign.rewards.map((reward, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-sm font-bold p-3 rounded-xl"
                            style={{ backgroundColor: `rgba(${highlightRgb}, 0.07)` }}
                          >
                            <span className="flex items-center gap-2 text-slate-700">
                              <ChevronRight size={14} style={{ color: highlightColor }} />
                              {reward.name}
                            </span>
                            <span
                              className="text-xs font-black px-2 py-1 rounded-full text-white"
                              style={{ backgroundColor: highlightColor }}
                            >
                              {reward.pointsRequired} selos
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {campaign.expirationDate && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                        <Clock size={13} />
                        Válido até {new Date(campaign.expirationDate).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-100 space-y-2">
              <p className="text-3xl">🔔</p>
              <p className="text-slate-500 font-semibold">Nenhuma campanha ativa no momento.</p>
              <p className="text-slate-400 text-sm">Cadastre-se para ser avisado quando houver novidades!</p>
            </div>
          )}
        </section>

        {/* Location card */}
        {hasLocation && (
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <MapPin size={18} style={{ color: highlightColor }} />
              Localização
            </h2>
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
              {/* Map placeholder visual */}
              <div
                className="w-full h-32 flex items-center justify-center relative"
                style={{ background: `linear-gradient(135deg, rgba(${highlightRgb},0.12), rgba(${highlightRgb},0.05))` }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: highlightColor }}
                >
                  <MapPin size={28} className="text-white" />
                </div>
              </div>
              <div className="p-4 space-y-3">
                {store.address && (
                  <p className="text-sm text-slate-600 font-medium text-center">{store.address}</p>
                )}
                <button
                  onClick={openMaps}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm text-white shadow-md active:scale-95 transition-transform"
                  style={{ backgroundColor: highlightColor }}
                >
                  <Navigation size={16} />
                  ABRIR NO MAPS
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <div
          className="rounded-3xl p-6 text-center space-y-4 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${highlightColor}, rgba(${highlightRgb}, 0.75))` }}
        >
          <p className="text-white font-black text-lg drop-shadow-sm">Pronto para começar?</p>
          <p className="text-white/80 text-sm">Crie sua conta grátis e comece a colecionar selos agora mesmo!</p>
          <button
            onClick={() => router.push(registerUrl)}
            className="w-full bg-white font-black text-sm py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
            style={{ color: highlightColor }}
          >
            CRIAR MINHA CONTA GRÁTIS →
          </button>
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
