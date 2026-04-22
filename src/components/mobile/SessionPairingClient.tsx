/**
 * Componente de Pareamento por Sessão (Cliente Mobile)
 *
 * O cliente digita um PIN de 4 dígitos para se conectar à loja
 * e receber selos instantaneamente — sem QR Code, sem NFC.
 *
 * 🧠 Psychological Principle: Flow State (Csikszentmihalyi)
 * Minimal friction + instant feedback = optimal engagement.
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sessionPairingClientService, CustomerSessionStatusResponse } from '@/lib/session-pairing-service';
import { Zap, CheckCircle2, Loader2, X, Wifi } from 'lucide-react';
import { triggerSuccessConfetti } from '@/lib/confetti';
import { playStampSound } from '@/lib/sounds';

interface SessionPairingClientProps {
  onClose: () => void;
  onStampReceived?: () => void;
}

export const SessionPairingClient: React.FC<SessionPairingClientProps> = ({ onClose, onStampReceived }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [status, setStatus] = useState<'input' | 'connecting' | 'connected' | 'stamped' | 'error'>('input');
  const [sessionInfo, setSessionInfo] = useState<{ storeName?: string; campaignName?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stampCount, setStampCount] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newPin = [...pin];
    newPin[index] = value.slice(-1); // Only last digit
    setPin(newPin);

    // Auto-advance to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (value && index === 3 && newPin.every(d => d !== '')) {
      handleJoin(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleJoin = async (pinCode: string) => {
    try {
      setStatus('connecting');
      setError(null);

      const result = await sessionPairingClientService.joinSession(pinCode);

      if (result.success && result.sessionId) {
        setSessionInfo({
          storeName: result.storeName,
          campaignName: result.campaignName,
        });
        setStatus('connected');

        // Haptic feedback
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate([50, 30, 50]);
        }

        // Start polling for stamp events
        startPolling(result.sessionId);
      } else {
        setError(result.message || 'PIN inválido.');
        setStatus('error');
      }
    } catch (err) {
      console.error('Session join error:', err);
      setError('Não foi possível conectar. Verifique o PIN.');
      setStatus('error');
    }
  };

  const startPolling = useCallback((sid: string) => {
    let lastStampCount = 0;

    pollingRef.current = setInterval(async () => {
      try {
        const sessionStatus: CustomerSessionStatusResponse = await sessionPairingClientService.getSessionStatus(sid);

        if (sessionStatus.isExpired || sessionStatus.status === 'EXPIRED') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setError('Sessão expirada. Peça um novo PIN ao lojista.');
          setStatus('error');
          return;
        }

        // Check if a new stamp was received
        if (sessionStatus.stampCount > lastStampCount) {
          lastStampCount = sessionStatus.stampCount;
          setStampCount(sessionStatus.stampCount);
          setStatus('stamped');

          // Celebration!
          triggerSuccessConfetti();
          playStampSound();
          if (typeof window !== 'undefined' && window.navigator.vibrate) {
            window.navigator.vibrate([100, 50, 100, 50, 100]);
          }

          onStampReceived?.();

          // Reset to connected after 3 seconds
          setTimeout(() => {
            setStatus('connected');
          }, 3000);
        }
      } catch (err) {
        console.error('Session poll error:', err);
      }
    }, 2000); // Poll every 2 seconds
  }, [onStampReceived]);

  const handleReset = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setPin(['', '', '', '']);
    setStatus('input');
    setSessionInfo(null);
    setError(null);
    setStampCount(0);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Conexão Rápida</h3>
            <p className="text-xs text-slate-400 font-medium">Digite o PIN do lojista</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={18} />
        </button>
      </div>

      {status === 'input' || status === 'error' ? (
        <div className="space-y-5">
          {/* PIN Input */}
          <div className="flex justify-center gap-3">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handlePinChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className={`w-16 h-20 text-center text-3xl font-black rounded-2xl border-2 transition-all outline-none ${
                  digit
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                } focus:border-primary focus:ring-4 focus:ring-primary/10`}
                autoComplete="off"
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold animate-in fade-in zoom-in-95 duration-200">
              <X size={14} />
              <span>{error}</span>
            </div>
          )}

          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Peça o PIN de 4 dígitos ao lojista
          </p>

          {status === 'error' && (
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-colors"
            >
              Tentar Novamente
            </button>
          )}
        </div>
      ) : status === 'connecting' ? (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative p-4 rounded-full bg-primary/10 text-primary">
              <Loader2 size={32} className="animate-spin" />
            </div>
          </div>
          <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Conectando...</p>
        </div>
      ) : status === 'connected' ? (
        <div className="space-y-4">
          {/* Connected state */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 text-center space-y-3 animate-in zoom-in-95 duration-300">
            <div className="relative inline-flex">
              <div className="absolute inset-0 bg-emerald-200 rounded-full animate-pulse" />
              <div className="relative p-3 rounded-full bg-emerald-100 text-emerald-600">
                <Wifi size={28} />
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Conectado</p>
              <p className="text-xl font-black text-emerald-800 tracking-tight mt-1">{sessionInfo?.storeName}</p>
              <p className="text-xs text-emerald-600/70 font-bold mt-0.5">{sessionInfo?.campaignName}</p>
            </div>
            {stampCount > 0 && (
              <p className="text-[10px] text-emerald-600 font-bold">
                {stampCount} selo(s) recebido(s) nesta sessão
              </p>
            )}
          </div>

          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Aguardando selo do lojista...
          </p>

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Desconectar
          </button>
        </div>
      ) : status === 'stamped' ? (
        <div className="flex flex-col items-center justify-center py-6 gap-4 animate-in zoom-in-95 duration-300">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping duration-1000" />
            <div className="relative bg-primary text-white p-5 rounded-full shadow-xl shadow-primary/30 border-4 border-white">
              <CheckCircle2 size={40} strokeWidth={3} />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Selo Recebido!</h3>
            <p className="text-slate-500 font-bold text-xs mt-1">{sessionInfo?.storeName} • {sessionInfo?.campaignName}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-2">Total nesta sessão: {stampCount}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
