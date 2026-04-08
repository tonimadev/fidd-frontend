'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, CameraOff, Loader2 } from 'lucide-react';

interface QrScannerProps {
  onResult: (decodedText: string) => void;
  onError?: (errorMessage: string) => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onResult, onError }) => {
  const [isStarting, setIsStarting] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = "qr-reader-region";

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          scanner = new Html5Qrcode(regionId);
          scannerRef.current = scanner;

          const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          };

          await scanner.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              // Beep ou feedback visual aqui?
              onResult(decodedText);
            },
            () => {
              // Erros de frame são silenciosos para não poluir
            }
          );
          setIsStarting(false);
        } else {
          setIsStarting(false);
          setCameraError("Câmera não encontrada.");
        }
      } catch (err) {
        console.error("Erro ao iniciar scanner:", err);
        setIsStarting(false);
        setCameraError("Permissão de câmera negada ou erro ao acessar.");
        if (onError) onError(String(err));
      }
    };

    startScanner();

    return () => {
      if (scanner && scanner.isScanning) {
        scanner.stop().catch(e => console.error("Erro ao parar scanner:", e));
      }
    };
  }, [onResult, onError]);

  if (isStarting) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Iniciando câmera...</p>
      </div>
    );
  }

  if (cameraError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500">
          <CameraOff size={32} />
        </div>
        <div className="text-center px-6">
          <p className="text-slate-800 font-bold">{cameraError}</p>
          <p className="text-slate-500 text-xs mt-1">Certifique-se que o site tem permissão para usar a câmera.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-black aspect-square max-w-[300px] mx-auto border-4 border-slate-100 shadow-inner">
      <div id={regionId} className="w-full h-full"></div>
      
      {/* Overlay de mira */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-48 h-48 border-2 border-white/50 rounded-2xl relative">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary -mt-1 -ml-1 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary -mt-1 -mr-1 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary -mb-1 -ml-1 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary -mb-1 -mr-1 rounded-br-lg"></div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2">
          <Camera size={14} className="text-white" />
          <span className="text-[10px] text-white font-black uppercase tracking-widest">Scanner Ativo</span>
        </div>
      </div>
    </div>
  );
};
