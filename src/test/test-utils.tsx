import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { vi, beforeEach, afterEach } from 'vitest';
import { User } from 'firebase/auth';
import { AppUser, UserType } from '../types/user';

// ============================================================================
// Mock Data Generators
// ============================================================================

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  uid: 'test-uid-123',
  email: 'test@example.com',
  emailVerified: true,
  displayName: 'Test User',
  photoURL: null,
  phoneNumber: null,
  isAnonymous: false,
  tenantId: null,
  providerId: 'firebase',
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  providerData: [],
  refreshToken: 'mock-refresh-token',
  delete: vi.fn(),
  getIdToken: vi.fn().mockResolvedValue('mock-id-token'),
  getIdTokenResult: vi.fn(),
  reload: vi.fn(),
  toJSON: vi.fn(),
  ...overrides,
} as User);

export const createMockAppUser = (overrides: Partial<AppUser> = {}): AppUser => ({
  uid: 'test-uid-123',
  email: 'test@example.com',
  emailVerified: true,
  displayName: 'Test User',
  photoURL: null,
  profilePicture: undefined,
  userType: 'customer' as UserType,
  createdAt: new Date(),
  isOwnProfile: true,
  ...overrides,
});

export const createMockAuthContext = (overrides = {}) => ({
  currentUser: null,
  userProfile: null,
  loading: false,
  error: null,
  signup: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  resetPassword: vi.fn(),
  updateUserType: vi.fn(),
  refreshUserProfile: vi.fn(),
  clearError: vi.fn(),
  ...overrides,
});

// ============================================================================
// Test Providers
// ============================================================================

interface AllProvidersProps {
  children: ReactNode;
}

/**
 * Wrapper component that provides all necessary providers for testing
 */
export const AllProviders: React.FC<AllProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

/**
 * Memory router wrapper for testing specific routes
 */
interface MemoryRouterWrapperProps extends MemoryRouterProps {
  children: ReactNode;
}

export const MemoryRouterWrapper: React.FC<MemoryRouterWrapperProps> = ({
  children,
  initialEntries = ['/'],
  ...props
}) => {
  return (
    <MemoryRouter initialEntries={initialEntries} {...props}>
      {children}
    </MemoryRouter>
  );
};

// ============================================================================
// Custom Render Functions
// ============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  initialEntries?: string[];
}

/**
 * Custom render function that wraps components with all providers
 */
export const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult => {
  const { initialEntries, ...renderOptions } = options;

  const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
    if (initialEntries) {
      return (
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      );
    }
    return <AllProviders>{children}</AllProviders>;
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Wait for a condition to be true
 */
export const waitFor = async (
  condition: () => boolean,
  timeout = 5000,
  interval = 50
): Promise<void> => {
  const startTime = Date.now();
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('waitFor timeout');
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
};

/**
 * Create a mock function that resolves after a delay
 */
export const createAsyncMock = <T,>(
  resolveValue: T,
  delay = 0
): ReturnType<typeof vi.fn> => {
  return vi.fn().mockImplementation(
    () => new Promise((resolve) => setTimeout(() => resolve(resolveValue), delay))
  );
};

/**
 * Create a mock function that rejects after a delay
 */
export const createAsyncRejectMock = (
  error: Error,
  delay = 0
): ReturnType<typeof vi.fn> => {
  return vi.fn().mockImplementation(
    () => new Promise((_, reject) => setTimeout(() => reject(error), delay))
  );
};

/**
 * Flush all pending promises
 */
export const flushPromises = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 0));
};

/**
 * Mock console methods for cleaner test output
 */
export const mockConsole = () => {
  const originalConsole = { ...console };
  
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  return originalConsole;
};

// ============================================================================
// Re-export testing-library utilities
// ============================================================================

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Override render with custom render
export { customRender as render };

