import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock for Next.js router
const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
};

// Mock for Next.js useRouter hook
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock for Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className }: any) => (
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

// Custom render function that includes providers if needed
function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  return {
    user: userEvent.setup(),
    ...render(ui, options),
    mockRouter,
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };