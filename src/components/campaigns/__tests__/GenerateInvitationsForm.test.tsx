/**
 * Testes para GenerateInvitationsForm.tsx
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { GenerateInvitationsForm } from '@/components/campaigns/GenerateInvitationsForm';
import { invitationService } from '@/lib/invitation-service';

jest.mock('@/lib/invitation-service', () => ({
  invitationService: {
    generateInvitations: jest.fn(),
  },
}));

describe('GenerateInvitationsForm', () => {
  const campaignProps = {
    campaignId: 1,
    campaignName: 'Minha Campanha',
    onSuccess: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário de geração de convites', () => {
    render(<GenerateInvitationsForm {...campaignProps} />);

    expect(screen.getByText(/Gerando convites para a campanha:/i)).toBeInTheDocument();
    expect(screen.getByText('Minha Campanha')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantidade de Convites')).toBeInTheDocument();
    expect(screen.getByLabelText('Pontos por Convite')).toBeInTheDocument();
    expect(screen.getByLabelText('Expiração (em minutos)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Gerar Convites/i })).toBeInTheDocument();
  });

  it('deve mostrar erros de validação para valores inválidos', async () => {
    render(<GenerateInvitationsForm {...campaignProps} />);

    const quantityInput = screen.getByLabelText('Quantidade de Convites');
    const submitButton = screen.getByRole('button', { name: /Gerar Convites/i });

    fireEvent.change(quantityInput, { target: { value: '0' } });
    fireEvent.blur(quantityInput);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Quantidade mínima é 1 convite')).toBeInTheDocument();
    });
  });

  it('deve gerar convites com sucesso e exibir a lista', async () => {
    const mockResponse = {
      campaignId: 1,
      campaignName: 'Minha Campanha',
      totalGenerated: 2,
      message: '2 convites gerados!',
      invitations: [
        {
          id: 101,
          inviteToken: 'ABC123',
          campaignName: 'Minha Campanha',
          points: 5,
          expiresAt: '2026-03-10T10:00:00Z',
          inviteUrl: 'https://fidd.app/i/ABC123',
          qrCodeUrl: 'https://api.fidd.app/qr/ABC123',
          message: 'Você ganhou 5 pontos!',
        },
        {
          id: 102,
          inviteToken: 'DEF456',
          campaignName: 'Minha Campanha',
          points: 5,
          expiresAt: '2026-03-10T10:00:00Z',
          inviteUrl: 'https://fidd.app/i/DEF456',
          qrCodeUrl: 'https://api.fidd.app/qr/DEF456',
          message: 'Você ganhou 5 pontos!',
        },
      ],
    };

    (invitationService.generateInvitations as jest.Mock).mockResolvedValue(mockResponse);

    render(<GenerateInvitationsForm {...campaignProps} />);

    const submitButton = screen.getByRole('button', { name: /Gerar Convites/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Convites Gerados com Sucesso!')).toBeInTheDocument();
      expect(screen.getByText('2 convites gerados!')).toBeInTheDocument();
    });

    // Verificar se os tokens (códigos de 6 caracteres) estão visíveis
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('DEF456')).toBeInTheDocument();

    // Verificar se os pontos estão visíveis
    const pointsLabels = screen.getAllByText('5 pontos');
    expect(pointsLabels).toHaveLength(2);

    // Verificar botões de ação na lista
    expect(screen.getAllByText('Copiar Código')).toHaveLength(2);
    expect(screen.getAllByText('Copiar Link')).toHaveLength(2);
  });

  it('deve chamar onCancel quando o botão cancelar é clicado', () => {
    render(<GenerateInvitationsForm {...campaignProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);
    
    expect(campaignProps.onCancel).toHaveBeenCalled();
  });
});
