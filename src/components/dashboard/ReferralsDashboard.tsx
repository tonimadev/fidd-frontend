'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { apiClient } from '@/lib/api-client';
import { ProUpgradeGate } from './ProUpgradeGate';
import { Users, UserPlus, TrendingUp } from 'lucide-react';
import axios from 'axios';

interface ReferralStats {
  totalNewCustomers: number;
  isPro: boolean;
}

export const ReferralsDashboard: React.FC = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<ReferralStats>('/api/web/v1/referrals/stats');
        setStats(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          setError('PRO_ONLY');
        } else {
          setError('Erro ao carregar estatísticas de indicação');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando estatísticas...</div>;

  if (error === 'PRO_ONLY' || (stats && !stats.isPro)) {
    return (
      <ProUpgradeGate 
        title="Motor de Indicação PRO"
        description={`Transforme seus clientes em promotores. Cresça sua base de forma orgânica e viral com o sistema de indicação integrado.
        
        • Links de indicação únicos para cada cliente
        • Selos bônus automáticos por novas indicações
        • Estatísticas de crescimento viral e novos clientes`}
        icon={<Users className="w-12 h-12" />}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Indicações (Member-Get-Member)</h2>
        <p className="text-muted-foreground">Veja como seus clientes estão ajudando seu negócio a crescer.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Novos Clientes via Indicação</CardDescription>
            <CardTitle className="text-4xl flex items-center gap-2">
              <UserPlus className="w-8 h-8 text-blue-500" />
              {stats?.totalNewCustomers || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Clientes que realizaram a primeira compra após indicação.</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Como funciona o Motor de Indicação?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex gap-4">
              <div className="bg-primary/10 p-2 rounded-lg h-fit">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground mb-1">Crescimento Orgânico</p>
                <p>Seus clientes compartilham um link exclusivo da sua loja com amigos e familiares via WhatsApp ou redes sociais.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-primary/10 p-2 rounded-lg h-fit">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground mb-1">Incentivo Automático</p>
                <p>Quando o indicado ganha seu primeiro selo na sua loja, quem indicou recebe automaticamente 1 selo bônus em sua cartela ativa.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-primary/10 p-2 rounded-lg h-fit">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground mb-1">Custo Zero de Aquisição</p>
                <p>Você adquire novos clientes fiéis sem gastar com anúncios, apenas recompensando quem já ama sua marca.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
