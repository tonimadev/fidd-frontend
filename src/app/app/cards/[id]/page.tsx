/**
 * Detalhes do cartão do cliente (mobile web)
 */

'use client';

import React, { useEffect, useState } from 'react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { mobileCardService } from '@/lib/mobile-card-service';
import { MobileCardResponse } from '@/types/mobile-cards';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, QrCode, Info, CheckCircle2, AlertTriangle, Calendar, Share2, BadgeCheck } from 'lucide-react';
import { UnifiedScannerModal } from '@/components/mobile/UnifiedScannerModal';
import { useAuth } from '@/context/auth-context';
import { triggerConfetti } from '@/lib/confetti';

const VerifiedBadge = () => (
  <BadgeCheck className="text-amber-400 fill-amber-400/20" size={20} />
);

export default function CardDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [card, setCard] = useState<MobileCardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionCode, setRedemptionCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setIsLoading(true);
        const data = await mobileCardService.getCardById(Number(id));
        setCard(data);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os detalhes do cartão.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCard();
  }, [id]);

  const handleRedeem = async (rewardId?: number) => {
    try {
      setIsRedeeming(true);
      setError(null);
      const result = await mobileCardService.redeemReward(Number(id), rewardId);
      if (result.success) {
        setRedemptionCode(result.redemptionCode);
        triggerConfetti();
        // Atualizar os dados do cartão após resgate
        const updatedCard = await mobileCardService.getCardById(Number(id));
        setCard(updatedCard);
      } else {
        setError(result.message || 'Erro ao resgatar recompensa.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao processar o resgate.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleShare = () => {
    const refId = user?.publicId || user?.id;
    if (!refId || !card) return;

    const shareUrl = `${window.location.origin}/loja/${card.storeSlug}?ref=${refId}`;
    const text = `Ganhe prêmios na ${card.storeName}! Use meu link para começar a colecionar selos: ${shareUrl}`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="p-6 space-y-6 animate-pulse">
          <div className="h-8 w-32 bg-slate-200 rounded-lg" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
          <div className="h-24 bg-slate-200 rounded-2xl" />
        </div>
      </MobileLayout>
    );
  }

  if (!card) {
    return (
      <MobileLayout>
        <div className="p-6 text-center space-y-4">
          <AlertTriangle size={48} className="mx-auto text-amber-500" />
          <p className="font-bold text-slate-800">{error || 'Cartão não encontrado'}</p>
          <Button onClick={() => router.back()}>Voltar</Button>
        </div>
      </MobileLayout>
    );
  }

  const isCompleted = card.status === 'COMPLETED';
  const isRedeemed = card.status === 'REDEEMED';
  const isExpired = card.status === 'EXPIRED';
  const progressPercent = Math.min(100, (card.currentPoints / card.pointsRequired) * 100);

  return (
    <MobileLayout title="Detalhes do Cartão">
      <div className="p-6 space-y-6 pb-12">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1 text-primary font-bold uppercase text-xs tracking-widest mb-2"
        >
          <ChevronLeft size={16} />
          Voltar
        </button>

        {/* Status Badge */}
        <div className="flex justify-center">
          {isRedeemed ? (
            <span className="bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border border-secondary/20">
              <CheckCircle2 size={14} />
              Recompensa Resgatada
            </span>
          ) : isExpired ? (
            <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border border-red-200">
              <AlertTriangle size={14} />
              Cartão Expirado
            </span>
          ) : isCompleted ? (
            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border border-green-200">
              <CheckCircle2 size={14} />
              Pronto para Resgate
            </span>
          ) : null}
        </div>

        {/* Main Card Info */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-800 leading-tight">
            {card.campaignName}
          </h2>
          <p className="text-lg font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-2">
            {card.storeName}
            {card.isStorePro && <VerifiedBadge />}
          </p>
          
          {/* Share Button */}
          <div className="pt-2">
            <button 
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-xs font-black uppercase tracking-widest transition-colors shadow-md shadow-emerald-200 active:scale-95"
            >
              <Share2 size={14} />
              Indicar Amigo
            </button>
          </div>

          {card.expirationDate && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium pt-1">
              <Calendar size={14} />
              <span>
                {isRedeemed ? `Resgatado em: ${card.redeemedAt || 'N/A'}` : 
                 isExpired ? `Expirado em: ${card.expirationDate}` :
                 `Válido até: ${card.expirationDate}`}
              </span>
            </div>
          )}
        </div>

        {/* Progress Grid / Stamps */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          <div className="grid grid-cols-4 gap-4 mb-8 relative z-10">
            {Array.from({ length: card.pointsRequired }).map((_, index) => {
              const isFilled = index < card.currentPoints;
              return (
                <div 
                  key={index}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                    isFilled 
                      ? 'bg-primary border-primary text-white scale-100 shadow-lg shadow-primary/20' 
                      : 'bg-slate-50 border-slate-200 text-slate-300 scale-95'
                  }`}
                >
                  <span className={`text-lg font-black ${isFilled ? 'animate-in zoom-in-50' : ''}`}>
                    {index + 1}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex justify-between items-end">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Seu Progresso</span>
              <span className={`text-xl font-black ${isCompleted ? 'text-green-600' : 'text-primary'}`}>
                {card.currentPoints} / {card.pointsRequired}
              </span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className={`h-full transition-all duration-1000 ease-out rounded-full ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Intermediate Rewards */}
        {card.rewards && card.rewards.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Prêmios pelo Caminho</h3>
            <div className="space-y-3">
              {card.rewards.map((reward) => (
                <div 
                  key={reward.id} 
                  className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                    reward.isRedeemed 
                      ? 'bg-slate-50 border-slate-100 opacity-60' 
                      : reward.canRedeem 
                        ? 'bg-amber-50 border-amber-200 shadow-md shadow-amber-100' 
                        : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${reward.isRedeemed ? 'bg-slate-200 text-slate-500' : 'bg-amber-100 text-amber-600'}`}>
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className={`text-sm font-black ${reward.isRedeemed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                        {reward.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {reward.pointsRequired} selos
                      </p>
                    </div>
                  </div>
                  
                  {reward.canRedeem && !reward.isRedeemed && (
                    <Button 
                      size="sm" 
                      onClick={() => handleRedeem(reward.id)}
                      disabled={isRedeeming}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] uppercase h-8 px-4 rounded-xl shadow-sm"
                    >
                      Resgatar
                    </Button>
                  )}
                  
                  {reward.isRedeemed && (
                    <span className="text-[10px] font-black text-slate-400 uppercase italic">Resgatado</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {card.campaignDescription && (
          <Card className="border-none bg-slate-100/50 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3 text-slate-500">
                <Info size={18} />
                <h4 className="font-black uppercase tracking-widest text-xs">Regras e Descrição</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {card.campaignDescription}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Redemption Code / Action */}
        {redemptionCode ? (
          <div className="bg-primary p-8 rounded-[2.5rem] text-white text-center shadow-2xl shadow-primary/30 animate-in slide-in-from-bottom-4">
            <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-4 text-primary-foreground">Apresente este código na loja</p>
            <div className="text-5xl font-black tracking-[0.2em] my-6 font-mono bg-white/10 py-6 rounded-3xl border border-white/10">
              {redemptionCode}
            </div>
            <p className="text-[10px] font-bold uppercase leading-tight opacity-70">
              O atendente irá validar este código para entregar sua recompensa.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-bold border border-red-100">
                {error}
              </div>
            )}
            
            {isCompleted && !isRedeemed && !isExpired && (
              <Button 
                onClick={() => handleRedeem()}
                disabled={isRedeeming}
                className="w-full h-16 rounded-[1.5rem] text-lg font-black uppercase tracking-[0.1em] shadow-xl shadow-primary/30 active:scale-95 transition-all"
              >
                {isRedeeming ? 'Processando...' : 'Resgatar Recompensa'}
              </Button>
            )}

            {!isCompleted && !isRedeemed && !isExpired && (
              <Button 
                variant="outline"
                className="w-full h-16 rounded-[1.5rem] border-primary/20 bg-white text-primary font-black uppercase tracking-[0.1em] shadow-lg shadow-slate-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
                onClick={() => setIsCollectModalOpen(true)}
              >
                <QrCode size={24} />
                Escanear Pontos
              </Button>
            )}
          </div>
        )}
      </div>

      <UnifiedScannerModal 
        isOpen={isCollectModalOpen}
        onClose={() => setIsCollectModalOpen(false)}
        initialCardId={Number(id)}
        onSuccess={async () => {
          // Recarregar os dados do cartão após ganhar pontos
          const updatedCard = await mobileCardService.getCardById(Number(id));
          setCard(updatedCard);
        }}
      />
    </MobileLayout>
  );
}
