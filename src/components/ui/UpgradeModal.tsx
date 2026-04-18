'use client';

import React from 'react';
import { Button } from './Button';
import { useRouter } from 'next/navigation';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, title, description }) => {
  const router = useRouter();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-8 space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-primary/10 p-4 rounded-full text-primary">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">{title}</h3>
            <p className="text-muted-foreground whitespace-pre-line">{description}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button 
            className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold h-12"
            onClick={() => {
              onClose();
              router.push('/dashboard?tab=subscriptions');
            }}
          >
            Fazer Upgrade Agora
          </Button>
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={onClose}
          >
            Talvez mais tarde
          </Button>
        </div>
      </div>
    </div>
  );
};
