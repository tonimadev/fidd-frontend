/**
 * Componente de Check-in por Proximidade (Cliente Mobile)
 *
 * Floating bottom sheet que aparece quando o cliente está próximo de uma loja FIDD.
 * Permite coletar selos com um único toque — sem QR, sem código, sem NFC.
 *
 * 🧠 Psychological Principle: Endowed Progress Effect (Nunes & Drèze)
 * Showing the customer they're close to earning something creates a sense of
 * momentum that compels action.
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ProximityService, ProximityEvent, snoozeStore } from '@/lib/proximity-service';
import { proximityCheckinService } from '@/lib/proximity-checkin-service';
import { MobileStoreNearbyResponse } from '@/types/mobile-stores';
import { MapPin, CheckCircle2, X, Loader2, Zap } from 'lucide-react';
import { triggerSuccessConfetti } from '@/lib/confetti';
import { playStampSound } from '@/lib/sounds';

interface ProximityCheckinProps {
  stores: MobileStoreNearbyResponse[];
  onStampCollected?: () => void;
}

export const ProximityCheckin: React.FC<ProximityCheckinProps> = ({ stores, onStampCollected }) => {
  const [proximityEvent, setProximityEvent] = useState<ProximityEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const proximityServiceRef = useRef<ProximityService | null>(null);

  const handleProximity = useCallback((event: ProximityEvent) => {
    setProximityEvent(event);
    setResult(null);
    setIsDismissed(false);
    // Haptic feedback
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate([50, 30, 50]);
    }
  }, []);

  useEffect(() => {
    if (!ProximityService.isSupported() || stores.length === 0) return;

    const service = new ProximityService();
    proximityServiceRef.current = service;
    service.start(stores, handleProximity);

    return () => {
      service.stop();
    };
  }, [stores, handleProximity]);

  // Update stores when they change
  useEffect(() => {
    if (proximityServiceRef.current) {
      proximityServiceRef.current.updateStores(stores);
    }
  }, [stores]);

  const handleCheckin = async () => {
    if (!proximityEvent) return;

    try {
      setIsLoading(true);

      // Get fresh position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const response = await proximityCheckinService.checkin({
        storeId: proximityEvent.store.id,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      setResult({ success: response.success, message: response.message });

      if (response.success) {
        triggerSuccessConfetti();
        playStampSound();
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate([100, 50, 100]);
        }
        onStampCollected?.();

        // Auto-dismiss after success
        setTimeout(() => {
          setProximityEvent(null);
          setResult(null);
        }, 4000);
      }
    } catch (error) {
      console.error('Proximity check-in error:', error);
      setResult({ success: false, message: 'Erro ao fazer check-in. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    if (proximityEvent) {
      snoozeStore(proximityEvent.store.id);
    }
    setIsDismissed(true);
    setTimeout(() => {
      setProximityEvent(null);
      setIsDismissed(false);
    }, 300);
  };

  if (!proximityEvent || isDismissed) return null;

  return (
    <div className={`fixed bottom-24 left-4 right-4 z-40 animate-in slide-in-from-bottom-8 duration-500 ${isDismissed ? 'animate-out slide-out-to-bottom-8' : ''}`}>
      <div className="bg-white rounded-[2rem] shadow-2xl shadow-black/20 border border-slate-100 overflow-hidden">
        {/* Colored top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-primary to-emerald-500" />

        <div className="p-5">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-10"
          >
            <X size={16} />
          </button>

          {result ? (
            /* Result state */
            <div className="flex items-center gap-4 pr-8">
              <div className={`p-3 rounded-2xl shrink-0 ${result.success ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {result.success ? <CheckCircle2 size={28} /> : <X size={28} />}
              </div>
              <div>
                <p className={`text-sm font-black ${result.success ? 'text-emerald-800' : 'text-red-800'}`}>
                  {result.success ? 'Check-in Realizado!' : 'Erro no Check-in'}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {result.message}
                </p>
              </div>
            </div>
          ) : (
            /* Proximity prompt */
            <div className="space-y-4">
              <div className="flex items-center gap-4 pr-8">
                <div className="relative shrink-0">
                  {/* Pulsing ring */}
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl animate-ping" />
                  <div className="relative p-3 rounded-2xl bg-primary/10 text-primary">
                    <MapPin size={28} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-primary">
                    Loja Próxima
                  </p>
                  <p className="text-lg font-black text-slate-800 tracking-tight leading-tight">
                    {proximityEvent.store.tradeName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                    ~{proximityEvent.distanceMeters}m de distância
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCheckin}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/30 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Validando...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      <span>Ganhar Selo</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-3.5 rounded-2xl bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors active:scale-95"
                >
                  Depois
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
