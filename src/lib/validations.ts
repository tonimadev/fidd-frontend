/**
 * Schemas de validação com Zod
 */

import { z } from 'zod';

// Regex para validar senha forte
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Regex para validar CNPJ (14 dígitos)
const cnpjRegex = /^\d{14}$/;

// Regex para validar CPF (11 dígitos)
const cpfRegex = /^\d{11}$/;

/**
 * Remove caracteres de controle não imprimíveis e remove espaços extras
 */
const sanitizeString = (val: string) => val.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();

export const loginSchema = z.object({
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  password: z.string().min(1, 'Senha é obrigatória').max(100, 'Senha muito longa'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
});

export const resetPasswordSchema = z.object({
  token: z.string().uuid('Token inválido'),
  newPassword: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha muito longa')
    .regex(passwordRegex, 'Senha deve conter maiúscula, minúscula, número e caractere especial (@$!%*?&)'),
  confirmPassword: z.string().max(100, 'Senha muito longa'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export const registerSchema = z.object({
  tradeName: z.string()
    .transform(sanitizeString)
    .pipe(
      z.string()
        .min(3, 'Nome da loja deve ter pelo menos 3 caracteres')
        .max(100, 'Nome da loja não pode exceder 100 caracteres')
    ),
  taxIdType: z.enum(['CNPJ', 'CPF'], {
    message: 'Selecione CNPJ ou CPF'
  }),
  taxId: z.string().trim().min(1, 'Documento obrigatório').max(14, 'Documento inválido'),
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha muito longa')
    .regex(passwordRegex, 'Senha deve conter maiúscula, minúscula, número e caractere especial (@$!%*?&)'),
  confirmPassword: z.string().max(100, 'Senha muito longa'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
}).refine((data) => {
  // Validar CNPJ se selecionado
  if (data.taxIdType === 'CNPJ') {
    return cnpjRegex.test(data.taxId);
  }
  // Validar CPF se selecionado
  if (data.taxIdType === 'CPF') {
    return cpfRegex.test(data.taxId);
  }
  return false;
}, {
  message: 'Documento inválido para o tipo selecionado',
  path: ['taxId'],
});

export const createCampaignSchema = z.object({
  name: z.string()
    .transform(sanitizeString)
    .pipe(
      z.string()
        .min(3, 'Nome da campanha deve ter pelo menos 3 caracteres')
        .max(100, 'Nome da campanha não pode exceder 100 caracteres')
    ),
  pointsRequired: z.coerce.number()
    .int('Deve ser um número inteiro')
    .min(1, 'Pontos requeridos deve ser maior que 0')
    .max(10000, 'Pontos requeridos não pode exceder 10000'),
  expirationDate: z.string()
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Data de expiração não pode ser no passado'),
  description: z.string()
    .transform(sanitizeString)
    .pipe(
      z.string()
        .max(1000, 'A descrição não pode exceder 1000 caracteres')
    )
    .optional()
    .or(z.literal('')),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Senha é obrigatória').max(100, 'Senha muito longa'),
  confirmDeletion: z.boolean().refine((val) => val === true, {
    message: 'Você deve confirmar a deleção da conta',
  }),
});

export const generateInvitationsSchema = z.object({
  quantity: z.coerce.number()
    .int('Deve ser um número inteiro')
    .min(1, 'Quantidade mínima é 1 convite')
    .max(1000, 'Quantidade máxima é 1000 convites'),
  pointsPerInvitation: z.coerce.number()
    .int('Deve ser um número inteiro')
    .min(1, 'Pontos mínimos é 1')
    .max(10000, 'Pontos máximos é 10000'),
  expirationMinutes: z.coerce.number()
    .int('Deve ser um número inteiro')
    .min(5, 'Expiração mínima é 5 minutos')
    .max(10080, 'Expiração máxima é 7 dias (10080 minutos)'),
});

export const redemptionSchema = z.object({
  code: z.string()
    .trim()
    .length(6, 'O código deve ter exatamente 6 caracteres')
    .toUpperCase(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>;
export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;
export type GenerateInvitationsFormData = z.infer<typeof generateInvitationsSchema>;
export type RedemptionFormData = z.infer<typeof redemptionSchema>;

