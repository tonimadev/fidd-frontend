'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, CameraOff, Loader2, CheckCircle2 } from 'lucide-react';

interface QrScannerProps {
  onResult: (decodedText: string) => void;
  onError?: (errorMessage: string) => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onResult, onError }) => {
  const [isStarting, setIsStarting] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScannedRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const regionId = "qr-reader-region";

  // Debounced result handler to prevent double-scans
  const handleScanResult = useCallback((decodedText: string) => {
    // Ignore if same code was scanned in last 3 seconds
    if (lastScannedRef.current === decodedText) return;
    lastScannedRef.current = decodedText;

    // Clear previous debounce timer
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    // Show green flash
    setShowFlash(true);

    // Haptic feedback on detection
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate([80]);
    }

    // Fire result
    onResult(decodedText);

    // Reset debounce after 3 seconds
    debounceTimerRef.current = setTimeout(() => {
      lastScannedRef.current = null;
      setShowFlash(false);
    }, 3000);
  }, [onResult]);

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;
    let isMounted = true;

    const startScanner = async () => {
      // Pequeno delay para garantir que o elemento DOM com id={regionId} esteja renderizado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!isMounted) return;

      try {
        scanner = new Html5Qrcode(regionId);
        scannerRef.current = scanner;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        };

        // Tenta iniciar com a câmera traseira (environment)
        // O método start aceita uma string de constraints ou um objeto
        await scanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            if (isMounted) handleScanResult(decodedText);
          },
          () => {
            // Erros de frame são silenciosos
          }
        );
        
        if (isMounted) setIsStarting(false);
      } catch (err) {
        console.error("Erro ao iniciar scanner:", err);
        
        // Se falhar com environment, tenta sem restrições específicas (pode pegar a frontal)
        try {
          if (scanner && isMounted) {
            await scanner.start(
              {}, // Sem restrições de facingMode
              { fps: 10, qrbox: { width: 250, height: 250 } },
              (decodedText) => {
                if (isMounted) handleScanResult(decodedText);
              },
              () => {}
            );
            if (isMounted) setIsStarting(false);
            return;
          }
        } catch (secondErr) {
          console.error("Erro na segunda tentativa do scanner:", secondErr);
        }

        if (isMounted) {
          setIsStarting(false);
          setCameraError("Permissão de câmera negada ou erro ao acessar.");
          if (onError) onError(String(err));
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop()
            .then(() => {
              if (scannerRef.current) {
                scannerRef.current.clear();
              }
            })
            .catch(e => console.error("Erro ao parar scanner:", e));
        } else {
          // Caso não tenha começado a scanear mas já tenha instanciado
          try {
            scannerRef.current.clear();
          } catch {
            // Ignora erro de clear se não foi renderizado
          }
        }
      }
    };
  }, [handleScanResult, onError]);

  // Removido os early returns de isStarting e cameraError
  // para garantir que a div id={regionId} sempre seja renderizada

  return (
    <div className="relative overflow-hidden rounded-3xl bg-black aspect-square max-w-[300px] mx-auto border-4 border-slate-100 shadow-inner">
      {/* O container da câmera precisa estar sempre no DOM */}
      <div id={regionId} className={`w-full h-full ${isStarting || cameraError ? 'hidden' : 'block'}`}></div>
      
      {isStarting && !cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Iniciando câmera...</p>
        </div>
      )}

      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
            <CameraOff size={32} />
          </div>
          <p className="text-slate-800 font-bold">{cameraError}</p>
          <p className="text-slate-500 text-xs mt-1">Certifique-se que o site tem permissão para usar a câmera.</p>
        </div>
      )}

      {/* Green flash overlay on detection */}
      {showFlash && (
        <div className="absolute inset-0 bg-emerald-500/30 z-20 pointer-events-none animate-in fade-in duration-150">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 rounded-full bg-emerald-500 text-white shadow-2xl animate-in zoom-in-50 duration-300">
              <CheckCircle2 size={40} strokeWidth={3} />
            </div>
          </div>
        </div>
      )}

      {/* Overlay de mira */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className={`w-48 h-48 border-2 rounded-2xl relative transition-colors duration-300 ${showFlash ? 'border-emerald-400' : 'border-white/50'}`}>
          <div className={`absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 -mt-1 -ml-1 rounded-tl-lg transition-colors ${showFlash ? 'border-emerald-400' : 'border-primary'}`}></div>
          <div className={`absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 -mt-1 -mr-1 rounded-tr-lg transition-colors ${showFlash ? 'border-emerald-400' : 'border-primary'}`}></div>
          <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 -mb-1 -ml-1 rounded-bl-lg transition-colors ${showFlash ? 'border-emerald-400' : 'border-primary'}`}></div>
          <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 -mb-1 -mr-1 rounded-br-lg transition-colors ${showFlash ? 'border-emerald-400' : 'border-primary'}`}></div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className={`backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 transition-colors ${showFlash ? 'bg-emerald-500/80' : 'bg-black/50'}`}>
          {showFlash ? <CheckCircle2 size={14} className="text-white" /> : <Camera size={14} className="text-white" />}
          <span className="text-[10px] text-white font-black uppercase tracking-widest">
            {showFlash ? 'Detectado!' : 'Scanner Ativo'}
          </span>
        </div>
      </div>
    </div>
  );
};
