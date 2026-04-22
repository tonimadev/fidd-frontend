import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { RedemptionForm } from '../RedemptionForm';
import { redemptionService } from '@/lib/redemption-service';

jest.mock('@/lib/redemption-service', () => ({
  redemptionService: {
    validateRedemption: jest.fn(),
  },
}));

jest.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    user: { plan: 'Pro' }
  }),
}));

// Mock confetti to avoid canvas context errors in jsdom
jest.mock('@/lib/confetti', () => ({
  triggerConfetti: jest.fn(),
}));

jest.mock('canvas-confetti', () => jest.fn());

// Mock CelebrationOverlay to avoid confetti side-effects
jest.mock('@/components/ui/CelebrationOverlay', () => ({
  CelebrationOverlay: ({ isVisible, title }: { isVisible: boolean; title?: string }) =>
    isVisible ? <div data-testid="celebration-overlay">{title}</div> : null,
}));

describe('RedemptionForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário de resgate', () => {
    render(<RedemptionForm />);

    expect(screen.getByText('Resgate de Prêmio')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('XJ7K2P')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /validar e resgatar/i })).toBeInTheDocument();
  });

  it('deve validar e mostrar sucesso ao digitar um código válido', async () => {
    const mockResponse = {
      success: true,
      message: 'Resgate realizado com sucesso!',
      customerName: 'João Silva',
      campaignName: 'Compre 10 Cafés, ganhe 1',
      redeemedAt: '2026-03-09T14:30:00'
    };

    (redemptionService.validateRedemption as jest.Mock).mockResolvedValue(mockResponse);

    render(<RedemptionForm />);

    const input = screen.getByPlaceholderText('XJ7K2P');
    fireEvent.change(input, { target: { value: 'XJ7K2P' } });
    
    const button = screen.getByRole('button', { name: /validar e resgatar/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(redemptionService.validateRedemption).toHaveBeenCalledWith({ code: 'XJ7K2P' });
      expect(screen.getByText('Resgate realizado com sucesso!')).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Compre 10 Cafés, ganhe 1')).toBeInTheDocument();
    });
  });

  it('deve mostrar erro quando o código for inválido', async () => {
    const errorMessage = 'Este código já foi utilizado em 2026-03-09T10:15:00';
    (redemptionService.validateRedemption as jest.Mock).mockRejectedValue({
      isAxiosError: true,
      response: {
        data: {
          success: false,
          message: errorMessage
        }
      }
    });

    render(<RedemptionForm />);

    const input = screen.getByPlaceholderText('XJ7K2P');
    fireEvent.change(input, { target: { value: 'USED01' } });
    
    const button = screen.getByRole('button', { name: /validar e resgatar/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('deve mostrar erro de validação para códigos com tamanho diferente de 6', async () => {
    render(<RedemptionForm />);

    const input = screen.getByPlaceholderText('XJ7K2P');
    fireEvent.change(input, { target: { value: 'ABC' } });
    
    const button = screen.getByRole('button', { name: /validar e resgatar/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('O código deve ter exatamente 6 caracteres')).toBeInTheDocument();
    });
  });
});
