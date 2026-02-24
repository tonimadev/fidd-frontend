/**
 * Utilitário de teste para renderizar componentes com providers
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Mock para AuthProvider se necessário
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <MockAuthProvider>{children}</MockAuthProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

