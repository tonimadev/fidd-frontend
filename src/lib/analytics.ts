import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

/**
 * Tipos de eventos suportados pelo Analytics.
 * Adicione novos eventos aqui para manter a consistência e o typing.
 * NUNCA envie informações pessoais (e-mail, nome, telefone) nestes parâmetros.
 */
export type AnalyticsEvents = {
  // Autenticação
  login: { method: 'email' | 'google' };
  login_failed: { method: 'email' | 'google'; error_type?: string };
  registration: { method: 'email' | 'google' };
  registration_failed: { method: 'email' | 'google'; error_type?: string };
  logout: undefined;
  account_reactivation: { status: 'success' | 'failed' };
  email_verification: { status: 'success' | 'failed' };
  email_verification_requested: { user_type: 'customer' | 'store' };
  forgot_password_click: undefined;
  navigate_to_register: undefined;
  
  // Campanhas e Convites
  invitations_generated: { 
    campaign_id: number; 
    quantity: number; 
    points_per_invitation: number;
    expiration_minutes: number;
  };
  invitation_generation_failed: { 
    campaign_id: number; 
    error_type: string;
  };
  invitation_copied: { campaign_id: number };
  invitations_downloaded: { 
    campaign_id: number;
    quantity: number;
  };

  // Assinaturas
  subscription_plan_viewed: { plan_id: string };
  subscription_checkout_started: { plan_id: string; interval: 'monthly' | 'yearly' };
  
  // Dashboard e Navegação
  page_view: { path: string; title?: string };
  dashboard_metric_clicked: { metric_name: string };
};

class AnalyticsService {
  private static instance: AnalyticsService;
  private isDevelopment = process.env.NODE_ENV === 'development';

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Registra um evento no Analytics
   */
  public track<K extends keyof AnalyticsEvents>(
    eventName: K,
    params?: AnalyticsEvents[K]
  ): void {
    if (this.isDevelopment) {
      console.log(`[Analytics] Event: ${eventName}`, params);
    }

    if (typeof window !== 'undefined' && analytics) {
      try {
        // Garantir que não estamos enviando objetos complexos ou PII acidentalmente
        const sanitizedParams = params ? this.sanitizeParams(params) : undefined;
        logEvent(analytics, String(eventName), sanitizedParams as Record<string, unknown> | undefined);
      } catch (error) {
        if (this.isDevelopment) {
          console.error('[Analytics] Error logging event:', error);
        }
      }
    }
  }

  /**
   * Remove campos que possam conter PII ou que não sejam suportados
   */
  private sanitizeParams(params: Record<string, unknown>): Record<string, string | number | boolean> {
    const sanitized: Record<string, string | number | boolean> = {};
    
    for (const [key, value] of Object.entries(params)) {
      // Ignora chaves comuns de PII por segurança extra
      const piiKeys = ['email', 'name', 'password', 'phone', 'address', 'cpf', 'cnpj'];
      if (piiKeys.some(piiKey => key.toLowerCase().includes(piiKey))) {
        continue;
      }

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}

export const analyticsService = AnalyticsService.getInstance();
