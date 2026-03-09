import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { HelpCenter } from '@/components/dashboard/HelpCenter';
import { tutorialService } from '@/lib/tutorial-service';

jest.mock('@/lib/tutorial-service', () => ({
  tutorialService: {
    getTutorials: jest.fn(),
  },
}));

describe('HelpCenter', () => {
  const mockTutorials = [
    {
      id: 'campaign_management',
      title: 'Como Criar uma Campanha',
      description: 'Configure sua primeira campanha.',
      category: 'Configuração',
      steps: ['Passo 1', 'Passo 2'],
    },
    {
      id: 'invitation_marketing',
      title: 'Marketing de Convites',
      description: 'Atraia novos clientes.',
      category: 'Marketing',
      steps: ['Passo A', 'Passo B'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (tutorialService.getTutorials as jest.Mock).mockResolvedValue(mockTutorials);
  });

  it('não deve renderizar quando isOpen for false', () => {
    const { container } = render(<HelpCenter isOpen={false} onClose={jest.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('deve renderizar a lista de tutoriais quando aberto', async () => {
    render(<HelpCenter isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByText('Central de Ajuda')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Como Criar uma Campanha')).toBeInTheDocument();
      expect(screen.getByText('Marketing de Convites')).toBeInTheDocument();
    });

    expect(screen.getByText(/Configuração/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Marketing/i).length).toBeGreaterThan(0);
  });

  it('deve exibir os detalhes do tutorial ao clicar', async () => {
    render(<HelpCenter isOpen={true} onClose={jest.fn()} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Como Criar uma Campanha'));
    });

    expect(screen.getByText('Passo a passo')).toBeInTheDocument();
    expect(screen.getByText('Passo 1')).toBeInTheDocument();
    expect(screen.getByText('Passo 2')).toBeInTheDocument();
    expect(screen.getByText('Configure sua primeira campanha.')).toBeInTheDocument();
  });

  it('deve voltar para a lista ao clicar em Voltar', async () => {
    render(<HelpCenter isOpen={true} onClose={jest.fn()} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Como Criar uma Campanha'));
    });

    fireEvent.click(screen.getByText('Voltar para lista'));

    await waitFor(() => {
      expect(screen.getByText('Marketing de Convites')).toBeInTheDocument();
    });
  });

  it('deve abrir um tutorial específico se initialTutorialId for fornecido', async () => {
    render(<HelpCenter isOpen={true} onClose={jest.fn()} initialTutorialId="invitation_marketing" />);

    await waitFor(() => {
      expect(screen.getByText('Marketing de Convites')).toBeInTheDocument();
      expect(screen.getByText('Passo A')).toBeInTheDocument();
    });
  });

  it('deve chamar onClose ao clicar no botão fechar', () => {
    const onClose = jest.fn();
    render(<HelpCenter isOpen={true} onClose={onClose} />);

    const closeButtons = screen.getAllByRole('button');
    // O primeiro botão de fechar é o X no header
    fireEvent.click(closeButtons[0]);

    expect(onClose).toHaveBeenCalled();
  });
});
