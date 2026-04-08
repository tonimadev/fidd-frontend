import React, { useState, useEffect, useCallback } from 'react';
import { Tutorial } from '@/types/tutorial';
import { tutorialService } from '@/lib/tutorial-service';
import { Button } from '@/components/ui/Button';
import { DashboardTab } from '@/types/dashboard';

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: DashboardTab;
  initialTutorialId?: string | null;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ isOpen, onClose, activeTab, initialTutorialId }) => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const loadTutorials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tutorialService.getTutorials();
      
      // Ordenar: primeiro tutoriais que coincidem com o contexto da aba ativa
      const sorted = [...data].sort((a, b) => {
        const aMatches = a.id.includes(activeTab || '') || a.category.toLowerCase().includes(activeTab || '');
        const bMatches = b.id.includes(activeTab || '') || b.category.toLowerCase().includes(activeTab || '');
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
      });

      setTutorials(sorted);
    } catch (err) {
      setError('Não foi possível carregar os tutoriais.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (isOpen) {
      loadTutorials();
    } else {
      setSelectedTutorial(null);
    }
  }, [isOpen, loadTutorials]);

  // Se um tutorial inicial for passado ao abrir, selecione-o
  useEffect(() => {
    if (isOpen && initialTutorialId && tutorials.length > 0) {
      const tutorial = tutorials.find(t => t.id === initialTutorialId);
      if (tutorial) {
        setSelectedTutorial(tutorial);
      }
    }
  }, [isOpen, initialTutorialId, tutorials]);

  if (!isOpen) return null;

  // Agrupar tutoriais por categoria
  const groupedTutorials = tutorials.reduce((acc, tutorial) => {
    const category = tutorial.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tutorial);
    return acc;
  }, {} as Record<string, Tutorial[]>);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-48px)] sm:max-w-md max-h-[calc(100vh-120px)] bg-card shadow-2xl rounded-2xl flex flex-col border border-border animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-1.5 rounded-lg shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-none mb-1">Central de Ajuda</h2>
              <p className="text-[10px] text-muted-foreground leading-none">Aprenda a usar o FIDD</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            title="Fechar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-sm text-muted-foreground">Carregando guias...</p>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-500/10 rounded-xl border border-red-500/20">
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button size="sm" onClick={loadTutorials}>Tentar Novamente</Button>
            </div>
          ) : selectedTutorial ? (
            /* Detalhes do Tutorial */
            <div className="animate-in slide-in-from-right-4 duration-200">
              <button 
                onClick={() => setSelectedTutorial(null)}
                className="flex items-center gap-2 text-primary font-semibold text-sm mb-6 hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar para lista
              </button>

              <div className="mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {selectedTutorial.category}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                {selectedTutorial.title}
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {selectedTutorial.description}
              </p>

              <div className="space-y-6">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2" />
                  </svg>
                  Passo a passo
                </h4>
                <div className="space-y-4">
                  {selectedTutorial.steps.map((step, index) => (
                    <div key={index} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm border border-primary/20 transition-colors group-hover:bg-primary group-hover:text-white">
                        {index + 1}
                      </div>
                      <div className="pt-1 flex-1">
                        <p className="text-sm text-foreground/80 leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 p-6 bg-muted rounded-2xl border border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Ainda com dúvidas? Entre em contato com o suporte através de <span className="text-primary font-medium">suporte@fidd.com.br</span>
                </p>
              </div>
            </div>
          ) : (
            /* Lista de Tutoriais */
            <div className="space-y-8 animate-in fade-in duration-300">
              {Object.entries(groupedTutorials).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((tutorial) => (
                      <button
                        key={tutorial.id}
                        onClick={() => setSelectedTutorial(tutorial)}
                        className="w-full text-left p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                              {tutorial.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {tutorial.description}
                            </p>
                          </div>
                          <svg className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {tutorials.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">Nenhum tutorial disponível no momento.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/50">
          <Button 
            variant="outline" 
            className="w-full border-border text-muted-foreground hover:bg-card hover:text-foreground"
            onClick={onClose}
          >
            Fechar Central de Ajuda
          </Button>
        </div>
    </div>
  );
};
