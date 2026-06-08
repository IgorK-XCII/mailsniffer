import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement, ReactNode } from 'react';

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false, gcTime: 0 },
    },
  });

export const renderWithProviders = (
  ui: ReactElement,
  options: RenderOptions & { client?: QueryClient } = {},
) => {
  const { client = createTestQueryClient(), ...rest } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { client, ...render(ui, { wrapper: Wrapper, ...rest }) };
};
