import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccountSettings } from '../AccountSettings';
import { accountService } from '@/lib/account-service';

// Mock dependencies
jest.mock('@/lib/account-service', () => ({
  accountService: {
    getDeleteStatus: jest.fn(),
    getProfile: jest.fn(),
    uploadProfilePicture: jest.fn(),
    updateProfile: jest.fn(),
  },
}));

jest.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    logout: jest.fn(),
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock Image component
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ unoptimized, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { unoptimized?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt="" {...props} />
  ),
}));

// Mock Subcomponents to simplify
jest.mock('../AddressSettings', () => ({ AddressSettings: () => <div>AddressSettings</div> }));
jest.mock('../ApiKeysSettings', () => ({ ApiKeysSettings: () => <div>ApiKeysSettings</div> }));
jest.mock('../DeleteAccountModal', () => ({ DeleteAccountModal: () => <div>DeleteAccountModal</div> }));
jest.mock('../SecurityConfirmationModal', () => ({ SecurityConfirmationModal: () => <div>SecurityConfirmationModal</div> }));
jest.mock('../ImageCropperModal', () => ({ 
  ImageCropperModal: ({ onCancel }: { onCancel: () => void }) => (
    <div>
      <div>ImageCropperModal</div>
      <button onClick={onCancel}>Cancel Crop</button>
    </div>
  ) 
}));

describe('AccountSettings', () => {
  const mockProfile = {
    tradeName: 'Test Store',
    email: 'test@example.com',
    profilePictureUrl: 'http://example.com/pic.jpg',
    highlightColor: '#FF6B00',
  };

  beforeEach(() => {
    (accountService.getDeleteStatus as jest.Mock).mockResolvedValue({ status: 'ACTIVE' });
    (accountService.getProfile as jest.Mock).mockResolvedValue(mockProfile);
  });

  it('renders profile information', async () => {
    render(<AccountSettings />);
    
    expect(await screen.findByText('Configurações da Conta')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Store')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('opens cropper when an image is selected', async () => {
    render(<AccountSettings />);
    
    await screen.findByText('Configurações da Conta');
    
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Imagem do Estabelecimento/i) as HTMLInputElement;
    
    // Simula a seleção de arquivo
    fireEvent.change(input, { target: { files: [file] } });
    
    // Como usamos FileReader (assíncrono), precisamos esperar
    expect(await screen.findByText('ImageCropperModal')).toBeInTheDocument();
  });
});
