/**
 * Testes para CreateCampaignForm.tsx
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { CreateCampaignForm } from '@/components/campaigns/CreateCampaignForm';

jest.mock('@/lib/campaign-service', () => ({
  campaignService: {
    createCampaign: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Test Campaign',
      pointsRequired: 10,
      isActive: true,
      expirationDate: '2026-12-31',
      storeId: 1,
    }),
  },
}));

describe('CreateCampaignForm', () => {
  it('deve renderizar formulário de criação de campanha', () => {
    render(<CreateCampaignForm onSuccess={jest.fn()} />);

    expect(screen.getByPlaceholderText('Ex: Promoção de Verão')).toBeInTheDocument();
    expect(screen.getByLabelText('Pontos Requeridos')).toBeInTheDocument();
    expect(screen.getByLabelText('Data de Expiração')).toBeInTheDocument();
  });

  it('deve ter atalhos de data (1 e 2 meses)', () => {
    render(<CreateCampaignForm onSuccess={jest.fn()} />);

    expect(screen.getByRole('button', { name: '1 mês' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2 meses' })).toBeInTheDocument();
  });

  it('deve preencher data quando clica atalho de 1 mês', async () => {
    render(<CreateCampaignForm onSuccess={jest.fn()} />);

    const button1Mes = screen.getByRole('button', { name: '1 mês' });
    fireEvent.click(button1Mes);

    const dateInput = screen.getByLabelText('Data de Expiração') as HTMLInputElement;
    await waitFor(() => {
      expect(dateInput.value).not.toBe('');
    });
  });

  it('deve validar nome da campanha muito curto', async () => {
    render(<CreateCampaignForm onSuccess={jest.fn()} />);

    const nameInput = screen.getByPlaceholderText('Ex: Promoção de Verão');
    const submitButton = screen.getByRole('button', { name: /criar campanha/i });

    fireEvent.change(nameInput, { target: { value: 'ab' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Nome da campanha deve ter pelo menos 3 caracteres')
      ).toBeInTheDocument();
    });
  });

  it('deve chamar onCancel quando clica cancelar', () => {
    const onCancel = jest.fn();
    render(<CreateCampaignForm onSuccess={jest.fn()} onCancel={onCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });
});

