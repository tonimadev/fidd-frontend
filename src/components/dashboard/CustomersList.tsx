/**
 * Componente de listagem de clientes para o dashboard do lojista
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Customer } from '@/types/customer';
import { customerService } from '@/lib/customer-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ManualPunchCard } from './ManualPunchCard';

export const CustomersList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const [showManualPunch, setShowManualPunch] = useState(false);
  const [selectedIdentifier, setSelectedIdentifier] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await customerService.listCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Não foi possível carregar a lista de clientes.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isInactive = (customer: Customer) => {
    if (customer.activeCards > 0) return false;
    
    const lastActivity = new Date(customer.lastActivity);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return lastActivity < thirtyDaysAgo;
  };

  const filteredCustomers = showOnlyActive 
    ? customers.filter(c => !isInactive(c))
    : customers;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Gestão de Clientes</h2>
          <p className="text-muted-foreground">
            Acompanhe o engajamento dos seus clientes com seus programas de fidelidade.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-lg border border-border">
          <Button 
            size="sm" 
            variant={showOnlyActive ? 'primary' : 'ghost'} 
            onClick={() => setShowOnlyActive(true)}
            className="text-xs h-8"
          >
            Ativos no Mês
          </Button>
          <Button 
            size="sm" 
            variant={!showOnlyActive ? 'primary' : 'ghost'} 
            onClick={() => setShowOnlyActive(false)}
            className="text-xs h-8"
          >
            Todos os Clientes
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Button 
            size="sm" 
            variant={showManualPunch ? "outline" : "primary"}
            onClick={() => setShowManualPunch(!showManualPunch)}
            className="text-xs flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {showManualPunch ? "Fechar Carimbo" : "Carimbo Manual"}
          </Button>
        </div>

        {showManualPunch && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
             <ManualPunchCard 
               initialIdentifier={selectedIdentifier} 
               onSuccess={() => {
                 loadCustomers();
                 setSelectedIdentifier('');
               }} 
             />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted/30 animate-pulse rounded-xl border border-border"></div>
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-100 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700 text-sm">{error}</p>
            <Button size="sm" variant="outline" className="mt-4 border-red-200" onClick={loadCustomers}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      ) : filteredCustomers.length === 0 ? (
        <Card className="border-dashed py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Nenhum cliente encontrado</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              {showOnlyActive 
                ? "Nenhum cliente ativo nos últimos 30 dias foi encontrado. Tente ver todos os clientes." 
                : "Seu estabelecimento ainda não possui clientes cadastrados."}
            </p>
            {showOnlyActive && (
              <Button size="sm" variant="outline" className="mt-6" onClick={() => setShowOnlyActive(false)}>
                Ver Todos os Clientes
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow border-muted/60 overflow-hidden group">
              <CardHeader className="pb-2 space-y-0">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    customer.activeCards > 0 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {customer.activeCards > 0 ? 'ATIVO' : 'INATIVO'}
                  </div>
                </div>
                <CardTitle className="text-base mt-3 truncate">{customer.name}</CardTitle>
                <CardDescription className="text-xs truncate">{customer.email}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4 border-t border-muted/30 pt-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Cartões Ativos</p>
                    <p className="text-lg font-bold text-foreground">{customer.activeCards}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Total de Cartões</p>
                    <p className="text-lg font-bold text-foreground">{customer.totalCards}</p>
                  </div>
                </div>

                {customer.ongoingCards && customer.ongoingCards.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Progresso dos Cartões</p>
                    {customer.ongoingCards
                      .map(card => (
                        <div key={card.id} className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-medium truncate max-w-[120px]">{card.campaignName}</span>
                            <span className="font-bold">{card.currentPoints}/{card.pointsRequired}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="h-full transition-all duration-500" 
                              style={{ 
                                width: `${(card.currentPoints / card.pointsRequired) * 100}%`,
                                backgroundColor: card.highlightColor || 'var(--primary)'
                              }}
                            />
                          </div>
                        </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Última atividade: {new Date(customer.lastActivity).toLocaleDateString('pt-BR')}
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs font-bold border-primary/30 text-primary hover:bg-primary/5 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                    onClick={() => {
                      setSelectedIdentifier(customer.email);
                      setShowManualPunch(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Carimbar Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
