import { analyticsService } from '../analytics';
import { logEvent } from 'firebase/analytics';

// Mock do firebase/analytics
jest.mock('firebase/analytics', () => ({
  logEvent: jest.fn(),
}));

// Mock do firebase local
jest.mock('../firebase', () => ({
  analytics: { app: {} }, // Objeto dummy para passar na verificação de 'analytics'
}));

describe('AnalyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Simular ambiente de navegador
    // @ts-expect-error - Testando ambiente sem window
    delete global.window;
    // @ts-expect-error - Simular ambiente de navegador
    global.window = {} as Record<string, unknown>;
  });

  it('should log an event correctly', () => {
    analyticsService.track('login', { method: 'email' });

    expect(logEvent).toHaveBeenCalledWith(
      expect.anything(),
      'login',
      { method: 'email' }
    );
  });

  it('should sanitize PII from parameters', () => {
    // Forçar um tipo "errado" para testar o filtro de PII (em JS puro ou com cast)
    const paramsWithPII = {
      method: 'email',
      userEmail: 'test@example.com',
      userName: 'John Doe',
      userId: 123
    };

    // @ts-expect-error - Testando proteção em runtime
    analyticsService.track('login', paramsWithPII);

    expect(logEvent).toHaveBeenCalledWith(
      expect.anything(),
      'login',
      { method: 'email', userId: 123 }
    );
    
    const loggedParams = (logEvent as jest.Mock).mock.calls[0][2];
    expect(loggedParams).not.toHaveProperty('userEmail');
    expect(loggedParams).not.toHaveProperty('userName');
  });

  it('should not log if analytics is not initialized', async () => {
    // Mock do firebase para retornar null no analytics
    jest.resetModules();
    jest.mock('../firebase', () => ({
      analytics: null,
    }));
    
    // Re-importar o serviço após o novo mock usando dynamic import para evitar require()
    const { analyticsService: localService } = await import('../analytics');
    
    localService.track('login', { method: 'email' });
    expect(logEvent).not.toHaveBeenCalled();
  });

  it('should only accept string, number, or boolean values', () => {
    const paramsWithInvalidTypes = {
      plan_id: 'premium',
      metadata: { some: 'object' },
      callback: () => {}
    };

    // @ts-expect-error - Testando proteção em runtime
    analyticsService.track('subscription_plan_viewed', paramsWithInvalidTypes);

    expect(logEvent).toHaveBeenCalledWith(
      expect.anything(),
      'subscription_plan_viewed',
      { plan_id: 'premium' }
    );
  });
});
