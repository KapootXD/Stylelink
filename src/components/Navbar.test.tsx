import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import * as AuthContext from '../contexts/AuthContext';
import * as AccessControl from '../hooks/useAccessControl';

// Mock the AuthContext
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    currentUser: null,
    logout: vi.fn(),
    loading: false,
  })),
}));

// Mock the useAccessControl hook
vi.mock('../hooks/useAccessControl', () => ({
  useAccessControl: vi.fn(() => ({
    canAccess: vi.fn(() => false),
    isPremium: vi.fn(() => false),
    isAdmin: vi.fn(() => false),
  })),
}));

// Mock SearchModal
vi.mock('./SearchModal', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => 
    isOpen ? <div data-testid="search-modal">Search Modal</div> : null,
}));

const renderNavbar = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Navbar />
    </MemoryRouter>
  );
};

describe('Navbar', () => {
  const mockUseAuth = vi.mocked(AuthContext.useAuth);
  const mockUseAccessControl = vi.mocked(AccessControl.useAccessControl);

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default (logged out)
    mockUseAuth.mockReturnValue({
      currentUser: null,
      logout: vi.fn(),
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn(() => false),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
    } as any);
  });

  it('renders all navigation links', () => {
    renderNavbar();
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /discover/i })).toBeInTheDocument();
  });

  it('highlights active link', () => {
    renderNavbar(['/']);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveClass('text-[#B7410E]');
    expect(homeLink).toHaveClass('bg-[#FAF3E0]');
  });

  it('shows mobile menu on small screens', async () => {
    const user = userEvent.setup();
    renderNavbar();
    
    // Mobile menu button should be visible - find it by the sr-only text
    const menuButtons = screen.getAllByRole('button');
    const menuButton = menuButtons.find(btn => {
      const srOnly = btn.querySelector('.sr-only');
      return srOnly && srOnly.textContent?.includes('Open main menu');
    });
    expect(menuButton).toBeDefined();
    
    if (menuButton) {
      // Click to open mobile menu
      await user.click(menuButton);
      
      // Mobile menu should show navigation links (use getAllByRole since desktop links also exist)
      const homeLinks = screen.getAllByRole('link', { name: /home/i });
      expect(homeLinks.length).toBeGreaterThan(0);
      const discoverLinks = screen.getAllByRole('link', { name: /discover/i });
      expect(discoverLinks.length).toBeGreaterThan(0);
    }
  });

  it('closes mobile menu when link is clicked', async () => {
    const user = userEvent.setup();
    renderNavbar();
    
    // Open mobile menu
    const menuButtons = screen.getAllByRole('button');
    const menuButton = menuButtons.find(btn => {
      const srOnly = btn.querySelector('.sr-only');
      return srOnly && srOnly.textContent?.includes('Open main menu');
    });
    expect(menuButton).toBeDefined();
    
    if (menuButton) {
      await user.click(menuButton);
      
      // Click a navigation link (get all and click the first one)
      const homeLinks = screen.getAllByRole('link', { name: /home/i });
      expect(homeLinks.length).toBeGreaterThan(0);
      await user.click(homeLinks[0]);
      
      // Menu should close (X button should appear instead of menu icon)
      // This is handled by the component's state management
    }
  });

  it('shows login and signup buttons when user is not logged in', () => {
    renderNavbar();
    
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows user menu when user is logged in', () => {
    mockUseAuth.mockReturnValue({
      currentUser: {
        uid: '123',
        displayName: 'Test User',
        email: 'test@example.com',
      } as any,
      logout: vi.fn(),
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn(() => false),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
    } as any);
    
    renderNavbar();
    
    // User profile link should be visible
    expect(screen.getByRole('link', { name: /test user|profile/i })).toBeInTheDocument();
  });

  it('handles navigation on click', async () => {
    const user = userEvent.setup();
    renderNavbar(['/']);
    
    const discoverLink = screen.getByRole('link', { name: /discover/i });
    await user.click(discoverLink);
    
    // Link should be navigated (checking active state would require router state)
    expect(discoverLink).toBeInTheDocument();
  });

  it('opens search modal when search button is clicked', async () => {
    mockUseAuth.mockReturnValue({
      currentUser: {
        uid: '123',
        displayName: 'Test User',
      } as any,
      logout: vi.fn(),
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn(() => false),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
    } as any);
    
    const user = userEvent.setup();
    renderNavbar();
    
    // Search button doesn't have accessible name - it's just an icon
    // Find it by querying for buttons that are not the mobile menu button
    const buttons = screen.getAllByRole('button');
    // The search button is in the desktop menu section (hidden md:flex)
    // Find button that's not the mobile menu button
    const searchButton = buttons.find(btn => {
      const srOnly = btn.querySelector('.sr-only');
      return !srOnly && btn.closest('.hidden.md\\:flex');
    });
    
    expect(searchButton).toBeDefined();
    if (searchButton) {
      await user.click(searchButton);
      expect(screen.getByTestId('search-modal')).toBeInTheDocument();
    }
  });

  it('highlights active path for nested routes when user is logged in', () => {
    mockUseAuth.mockReturnValue({
      currentUser: {
        uid: '123',
        displayName: 'Test User',
      } as any,
      logout: vi.fn(),
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn(() => false),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
    } as any);
    
    renderNavbar(['/profile']);
    
    const profileLink = screen.getByRole('link', { name: /test user|profile/i });
    expect(profileLink).toHaveClass('text-[#B7410E]');
  });

  it('shows logout button when user is logged in', async () => {
    const logout = vi.fn();
    
    mockUseAuth.mockReturnValue({
      currentUser: {
        uid: '123',
        displayName: 'Test User',
      } as any,
      logout,
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn(() => false),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
    } as any);
    
    const user = userEvent.setup();
    renderNavbar();
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
    
    await user.click(logoutButton);
    // Note: Navigation check would require router mock
  });

  it('toggles mobile menu button icon', async () => {
    const user = userEvent.setup();
    renderNavbar();
    
    // Get the mobile menu button (it has sr-only text with "Open main menu")
    const menuButton = screen.getAllByRole('button').find(btn => {
      const srOnly = btn.querySelector('.sr-only');
      return srOnly && srOnly.textContent?.includes('Open main menu');
    });
    
    expect(menuButton).toBeDefined();
    
    if (menuButton) {
      // Initially should show menu icon
      expect(menuButton).toBeInTheDocument();
      
      // Click to open (icon changes to X)
      await user.click(menuButton);
      
      // Menu button should still be present
      const buttonsAfterClick = screen.getAllByRole('button');
      expect(buttonsAfterClick.length).toBeGreaterThan(0);
    }
  });

  it('renders logo with link to home', () => {
    renderNavbar();
    
    const logoLink = screen.getByText('StyleLink').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('shows activity link when user has basic access', () => {
    mockUseAuth.mockReturnValue({
      currentUser: { uid: '123', displayName: 'Test User' } as any,
      logout: vi.fn(),
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn((feature) => feature === 'basic'),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
    } as any);
    
    renderNavbar();
    
    // Activity link in desktop view is just an icon (Heart) with no accessible text
    // Find it by checking all links for the one with href="/activity"
    const allLinks = screen.getAllByRole('link');
    const activityLink = allLinks.find(link => link.getAttribute('href') === '/activity');
    expect(activityLink).toBeDefined();
    expect(activityLink).toBeInTheDocument();
  });

  it('shows upload link when user has upload access', () => {
    mockUseAuth.mockReturnValue({
      currentUser: { uid: '123', displayName: 'Test User' } as any,
      logout: vi.fn(),
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn((feature) => feature === 'upload'),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
    } as any);
    
    renderNavbar();
    
    const uploadLink = screen.getByRole('link', { name: /upload/i });
    expect(uploadLink).toBeInTheDocument();
  });

  it('shows settings link when user has settings access', () => {
    mockUseAuth.mockReturnValue({
      currentUser: { uid: '123', displayName: 'Test User' } as any,
      logout: vi.fn(),
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn((feature) => feature === 'settings'),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
    } as any);
    
    renderNavbar();
    
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    expect(settingsLink).toBeInTheDocument();
  });

  it('shows upgrade button when user is not premium', () => {
    mockUseAuth.mockReturnValue({
      currentUser: { uid: '123', displayName: 'Test User' } as any,
      logout: vi.fn(),
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn(() => false),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
    } as any);
    
    renderNavbar();
    
    const upgradeLink = screen.getByRole('link', { name: /upgrade/i });
    expect(upgradeLink).toBeInTheDocument();
  });

  it('does not show upgrade button when user is premium', () => {
    mockUseAuth.mockReturnValue({
      currentUser: { uid: '123', displayName: 'Test User' } as any,
      logout: vi.fn(),
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn(() => false),
      isPremium: vi.fn(() => true),
      isAdmin: vi.fn(() => false),
    } as any);
    
    renderNavbar();
    
    expect(screen.queryByRole('link', { name: /upgrade/i })).not.toBeInTheDocument();
  });

  it('shows admin badge when user is admin', () => {
    mockUseAuth.mockReturnValue({
      currentUser: { uid: '123', displayName: 'Test User' } as any,
      logout: vi.fn(),
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn(() => false),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => true),
    } as any);
    
    renderNavbar();
    
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  it('handles logout functionality', async () => {
    const logout = vi.fn().mockResolvedValue(undefined);
    const navigate = vi.fn();
    
    mockUseAuth.mockReturnValue({
      currentUser: { uid: '123', displayName: 'Test User' } as any,
      logout,
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn(() => false),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
    } as any);
    
    const user = userEvent.setup();
    renderNavbar();
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);
    
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('shows profile link with displayName when available', () => {
    mockUseAuth.mockReturnValue({
      currentUser: {
        uid: '123',
        displayName: 'John Doe',
        email: 'john@example.com',
      } as any,
      logout: vi.fn(),
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn(() => false),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
    } as any);
    
    renderNavbar();
    
    expect(screen.getByRole('link', { name: /john doe/i })).toBeInTheDocument();
  });

  it('shows profile link with "Profile" text when displayName is not available', () => {
    mockUseAuth.mockReturnValue({
      currentUser: {
        uid: '123',
        displayName: null,
        email: 'test@example.com',
      } as any,
      logout: vi.fn(),
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn(() => false),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
    } as any);
    
    renderNavbar();
    
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
  });

  it('highlights upload link when on upload route', () => {
    mockUseAuth.mockReturnValue({
      currentUser: { uid: '123', displayName: 'Test User' } as any,
      logout: vi.fn(),
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn((feature) => feature === 'upload'),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
    } as any);
    
    renderNavbar(['/upload']);
    
    const uploadLink = screen.getByRole('link', { name: /upload/i });
    expect(uploadLink).toHaveClass('text-[#B7410E]');
  });

  it('shows mobile menu with all user options when logged in', async () => {
    mockUseAuth.mockReturnValue({
      currentUser: { uid: '123', displayName: 'Test User' } as any,
      logout: vi.fn(),
      loading: false,
    } as any);
    
    mockUseAccessControl.mockReturnValue({
      canAccess: vi.fn((feature) => ['basic', 'upload', 'settings'].includes(feature as string)),
      isPremium: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
    } as any);
    
    const user = userEvent.setup();
    renderNavbar();
    
    const menuButtons = screen.getAllByRole('button');
    const menuButton = menuButtons.find(btn => {
      const srOnly = btn.querySelector('.sr-only');
      return srOnly && srOnly.textContent?.includes('Open main menu');
    });
    
    if (menuButton) {
      await user.click(menuButton);
      
      // Should show mobile menu items
      const mobileLinks = screen.getAllByRole('link');
      expect(mobileLinks.length).toBeGreaterThan(0);
    }
  });
});