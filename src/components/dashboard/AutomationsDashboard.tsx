'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { automationService, WinBackConfig, WinBackLog } from '@/lib/automation-service';
import { ProUpgradeGate } from './ProUpgradeGate';
import { useAuth } from '@/context/auth-context';
import { isUserPro } from '@/lib/auth-utils';
import axios from 'axios';

export const AutomationsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<WinBackConfig | null>(null);
  const [history, setHistory] = useState<WinBackLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [configData, historyData] = await Promise.all([
          automationService.getWinBackConfig(),
          automationService.getWinBackHistory()
        ]);
        setConfig(configData);
        setHistory(historyData);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          setError('PRO_ONLY');
        } else {
          setError('Erro ao carregar automações');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!config) return;
    try {
      setSaving(true);
      await automationService.updateWinBackConfig({
        enabled: config.enabled,
        days: config.days
      });
      alert("Configurações salvas com sucesso!");
    } catch {
      alert("Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando automações...</div>;
  
  const isPro = isUserPro(user);

  if (error === 'PRO_ONLY' || !isPro) {
    return (
      <ProUpgradeGate 
        title="Automações de Marketing PRO"
        description={`O FIDD trabalha por você: recupere clientes sumidos automaticamente sem precisar disparar uma única mensagem manual.
        
        • Identificação automática de clientes inativos
        • Envio de e-mails personalizados com sua logo
        • Lembretes de bônus para incentivar o retorno`}
        icon={
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Automações</h2>
          <p className="text-muted-foreground">Gerencie suas campanhas automáticas de marketing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recuperação de Clientes (Win-back)</CardTitle>
            <CardDescription>Envie um e-mail automático para clientes que não visitam sua loja há algum tempo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Ativar Automação</span>
                <span className="font-normal text-xs text-muted-foreground">O sistema enviará e-mails diariamente para clientes elegíveis.</span>
              </div>
              <input 
                type="checkbox"
                className="h-5 w-10 rounded-full appearance-none bg-muted checked:bg-primary transition-colors cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-3 after:h-3 after:rounded-full after:transition-transform checked:after:translate-x-5"
                checked={config?.enabled || false} 
                onChange={(e) => setConfig(prev => prev ? {...prev, enabled: e.target.checked} : null)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Dias de inatividade</label>
              <div className="flex items-center gap-4">
                <Input 
                  type="number" 
                  min="1" 
                  value={config?.days || 21}
                  onChange={(e) => setConfig(prev => prev ? {...prev, days: parseInt(e.target.value)} : null)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">dias sem novas compras</span>
              </div>
              <p className="text-xs text-muted-foreground">Recomendamos entre 21 e 30 dias para a maioria dos negócios.</p>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Envios</CardTitle>
            <CardDescription>E-mails enviados nos últimos 30 dias.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {history.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">Nenhum envio realizado ainda.</p>
                </div>
              ) : (
                history.map((log, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate text-foreground">{log.customerName}</p>
                      <p className="text-xs text-muted-foreground truncate">{log.customerEmail}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-foreground">{new Date(log.sentAt).toLocaleDateString('pt-BR')}</p>
                      <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Enviado</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
