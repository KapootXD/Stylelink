import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Search, Heart, LogOut, LogIn, Upload, Crown } from 'lucide-react';
import SearchModal from './SearchModal';
import { useAuth } from '../contexts/AuthContext';
import { useAccessControl } from '../hooks/useAccessControl';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, loading } = useAuth();
  const { canAccess, isAdmin, isPremium } = useAccessControl();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    ...(currentUser ? [{ name: 'Catalog', href: '/results' }] : []),
    { name: 'Discover', href: '/discover' }
  ];

  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchModalOpen(false);
      }
    };

    if (isMobileMenuOpen || isSearchModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen, isSearchModalOpen]);

  return (
    <nav className="bg-gradient-to-r from-white via-[#FFF8F0] to-white shadow-lg border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="text-2xl font-black tracking-tight text-[#B7410E] group-hover:text-[#8B5E3C] transition-colors">
                StyleLink
              </div>
              <span className="ml-2 px-2 py-1 text-[11px] uppercase tracking-widest bg-[#FAF3E0] text-[#B7410E] rounded-full font-semibold">Fashion Flow</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <div className="ml-6 flex items-center space-x-2 bg-white/70 backdrop-blur border border-amber-100 rounded-full px-2 py-1 shadow-sm">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActivePath(item.href)
                      ? 'text-[#B7410E] bg-[#FAF3E0] shadow-inner'
                      : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FFF4DC]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu & Search */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsSearchModalOpen(true)}
                  className="p-2 rounded-full text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0] transition-colors"
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </button>
                {canAccess('basic') && (
                  <Link
                    to="/activity"
                    className="p-2 rounded-full text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0] transition-colors"
                    aria-label="View activity"
                  >
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Activity</span>
                  </Link>
                )}
                <div className="flex items-center bg-white/80 backdrop-blur px-3 py-2 rounded-full border border-amber-100 shadow-sm space-x-2">
                  {canAccess('upload') && (
                    <Link
                      to="/upload"
                      className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        isActivePath('/upload')
                          ? 'text-[#B7410E] bg-[#FAF3E0] shadow-inner'
                          : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FFF4DC]'
                      }`}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActivePath('/profile')
                        ? 'text-[#B7410E] bg-[#FAF3E0] shadow-inner'
                        : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FFF4DC]'
                    }`}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {currentUser.displayName || 'Profile'}
                  </Link>
                  {canAccess('settings') && (
                    <Link
                      to="/settings"
                      className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        isActivePath('/settings')
                          ? 'text-[#B7410E] bg-[#FAF3E0] shadow-inner'
                          : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FFF4DC]'
                      }`}
                    >
                      Settings
                    </Link>
                  )}
                </div>
                {isAdmin() && (
                  <span className="flex items-center px-3 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 shadow-md">
                    <User className="h-4 w-4 mr-2" />
                    Admin
                  </span>
                )}
                {!isPremium() && (
                  <Link
                    to="/settings"
                    className="flex items-center px-3 py-2 rounded-full text-sm font-semibold text-white bg-[#B7410E] hover:bg-[#8B5E3C] shadow-md transition-colors"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex items-center px-3 py-2 rounded-full text-sm font-semibold text-[#2D2D2D] hover:text-[#B7410E] hover:bg-[#FAF3E0] border border-amber-100 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 rounded-full text-sm font-semibold text-[#2D2D2D] hover:text-[#B7410E] hover:bg-[#FAF3E0] border border-amber-100 transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-[#B7410E] hover:bg-[#8B5E3C] shadow-md transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#B7410E]"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-navigation" role="dialog" aria-label="Mobile navigation menu">
          <div className="px-3 pt-3 pb-4 space-y-2 sm:px-4 bg-white/90 backdrop-blur border-t border-secondary-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActivePath(item.href)
                    ? 'text-[#B7410E] bg-[#FAF3E0]'
                    : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0]'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {currentUser ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSearchModalOpen(true);
                    }}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0] w-full text-left border border-amber-100"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </button>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors border border-amber-100 ${
                      isActivePath('/profile')
                        ? 'text-[#B7410E] bg-[#FAF3E0]'
                        : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0]'
                    }`}
                  >
                    <User className="h-5 w-5 mr-2" />
                    {currentUser.displayName || 'Profile'}
                  </Link>
                </div>
                {canAccess('basic') && (
                  <Link
                    to="/activity"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActivePath('/activity')
                        ? 'text-[#B7410E] bg-[#FAF3E0]'
                        : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0]'
                    }`}
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Activity
                  </Link>
                )}
                {canAccess('upload') && (
                  <Link
                    to="/upload"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActivePath('/upload')
                        ? 'text-[#B7410E] bg-[#FAF3E0]'
                        : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0]'
                    }`}
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Upload
                  </Link>
                )}
                {canAccess('settings') && (
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActivePath('/settings')
                        ? 'text-[#B7410E] bg-[#FAF3E0]'
                        : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0]'
                    }`}
                  >
                    Settings
                  </Link>
                )}
                {isAdmin() && (
                  <div className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-red-500 to-red-600">
                    <User className="h-5 w-5 mr-2" />
                    Admin
                  </div>
                )}
                {!isPremium() && (
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-[#B7410E] hover:bg-[#8B5E3C] transition-colors"
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Upgrade
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={loading}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-[#2D2D2D] hover:text-[#B7410E] hover:bg-[#FAF3E0] w-full text-left"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-[#2D2D2D] hover:text-[#B7410E] hover:bg-[#FAF3E0]"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-[#B7410E] hover:bg-[#8B5E3C]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
