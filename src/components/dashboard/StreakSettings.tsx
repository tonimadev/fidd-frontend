'use client';

import React, { useState } from 'react';

export function StreakSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [target, setTarget] = useState(3);
  const [timeframe, setTimeframe] = useState('DAILY');
  const [rewardValue, setRewardValue] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Connect to real API endpoint
      // await api.put('/api/v1/store/streaks', { isEnabled, target, timeframe, rewardValue });
      await new Promise(resolve => setTimeout(resolve, 800)); // Mock delay
      alert('Configurações de Streak salvas com sucesso!');
    } catch {
      alert('Erro ao salvar configurações.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            🔥 Modo Streak (Visitas Consecutivas)
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Incentive clientes a retornarem frequentemente oferecendo recompensas extras por manterem uma sequência de visitas.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
        </label>
      </div>

      {isEnabled && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alvo (Visitas Consecutivas)
              </label>
              <input
                type="number"
                min="2"
                max="30"
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value) || 3)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Intervalo
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="DAILY">Diário (Todo dia)</option>
                <option value="WEEKLY">Semanal (Toda semana)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recompensa (Quantidade de Carimbos Extras)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={rewardValue}
                onChange={(e) => setRewardValue(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">Quando o cliente atingir o alvo, ele ganhará automaticamente estes carimbos extras em sua cartela.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                'Salvar Configurações'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
