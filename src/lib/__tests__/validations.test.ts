/**
 * Testes para validações
 */

import {
  loginSchema,
  registerSchema,
  createCampaignSchema,
  deleteAccountSchema,
  generateInvitationsSchema,
} from '@/lib/validations';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('deve validar email e senha válidos', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar email inválido', () => {
      const data = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar senha vazia', () => {
      const data = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('deve validar registro com CNPJ válido', () => {
      const data = {
        tradeName: 'Test Store',
        taxIdType: 'CNPJ',
        taxId: '12345678000195',
        email: 'test@example.com',
        password: 'Password123!@',
        confirmPassword: 'Password123!@',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve validar registro com CPF válido', () => {
      const data = {
        tradeName: 'Test Store',
        taxIdType: 'CPF',
        taxId: '12345678901',
        email: 'test@example.com',
        password: 'Password123!@',
        confirmPassword: 'Password123!@',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar CNPJ com tamanho incorreto', () => {
      const data = {
        tradeName: 'Test Store',
        taxIdType: 'CNPJ',
        taxId: '123456780001', // 12 dígitos ao invés de 14
        email: 'test@example.com',
        password: 'Password123!@',
        confirmPassword: 'Password123!@',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar senhas que não coincidem', () => {
      const data = {
        tradeName: 'Test Store',
        taxIdType: 'CNPJ',
        taxId: '12345678000195',
        email: 'test@example.com',
        password: 'Password123!@',
        confirmPassword: 'DifferentPassword123!@',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar senha fraca', () => {
      const data = {
        tradeName: 'Test Store',
        taxIdType: 'CNPJ',
        taxId: '12345678000195',
        email: 'test@example.com',
        password: 'weak', // Sem maiúscula, número, caractere especial
        confirmPassword: 'weak',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('createCampaignSchema', () => {
    it('deve validar campanha com dados válidos', () => {
      const data = {
        name: 'Summer Promo',
        pointsRequired: 10,
        expirationDate: '2026-12-31',
      };

      const result = createCampaignSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar nome muito curto', () => {
      const data = {
        name: 'ab',
        pointsRequired: 10,
        expirationDate: '2026-12-31',
      };

      const result = createCampaignSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar pontos zero', () => {
      const data = {
        name: 'Summer Promo',
        pointsRequired: 0,
        expirationDate: '2026-12-31',
      };

      const result = createCampaignSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar data no passado', () => {
      const data = {
        name: 'Summer Promo',
        pointsRequired: 10,
        expirationDate: '2020-01-01',
      };

      const result = createCampaignSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('deleteAccountSchema', () => {
    it('deve validar deleção com senha e confirmação', () => {
      const data = {
        password: 'Password123!@',
        confirmDeletion: true,
      };

      const result = deleteAccountSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar sem confirmação', () => {
      const data = {
        password: 'Password123!@',
        confirmDeletion: false,
      };

      const result = deleteAccountSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar senha vazia', () => {
      const data = {
        password: '',
        confirmDeletion: true,
      };

      const result = deleteAccountSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('generateInvitationsSchema', () => {
    it('deve validar geração com dados válidos', () => {
      const data = {
        quantity: 10,
        pointsPerInvitation: 5,
        expirationMinutes: 60,
      };

      const result = generateInvitationsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar quantidade acima do máximo', () => {
      const data = {
        quantity: 2000, // Máximo é 1000
        pointsPerInvitation: 5,
        expirationMinutes: 60,
      };

      const result = generateInvitationsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar expiração menor que 5 minutos', () => {
      const data = {
        quantity: 10,
        pointsPerInvitation: 5,
        expirationMinutes: 2, // Mínimo é 5
      };

      const result = generateInvitationsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('deve validar expiração de 7 dias', () => {
      const data = {
        quantity: 10,
        pointsPerInvitation: 5,
        expirationMinutes: 10080, // 7 dias
      };

      const result = generateInvitationsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

