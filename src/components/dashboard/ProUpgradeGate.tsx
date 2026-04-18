import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface ProUpgradeGateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const ProUpgradeGate: React.FC<ProUpgradeGateProps> = ({ title, description, icon }) => {
  const router = useRouter();

  return (
    <Card className="border-dashed border-2 p-12 flex flex-col items-center justify-center text-center space-y-6">
      <div className="bg-primary/10 p-4 rounded-full text-primary">
        {icon || (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
      </div>
      <div className="max-w-md">
        <CardTitle className="text-2xl mb-2 text-foreground">{title}</CardTitle>
        <CardDescription className="text-lg whitespace-pre-line">
          {description}
        </CardDescription>
      </div>
      <Button
        onClick={() => router.push('/dashboard?tab=subscriptions')}
        className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold h-12 px-8"
      >
        Desbloquear Recursos PRO
      </Button>
    </Card>
  );
};
