import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Search, Heart, LogOut, LogIn, Crown, Upload } from 'lucide-react';
import SearchModal from './SearchModal';
import { useAuth } from '../contexts/AuthContext';
import { useAccessControl } from '../hooks/useAccessControl';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, loading } = useAuth();
  const { canAccess, isPremium, isAdmin } = useAccessControl();

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
    { name: 'Discover', href: '/discover' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-[#B7410E]">
                StyleLink
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(item.href)
                      ? 'text-[#B7410E] bg-[#FAF3E0]'
                      : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu & Search */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <button 
                  onClick={() => setIsSearchModalOpen(true)}
                  className="p-2 rounded-full text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0] transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
                {canAccess('basic') && (
                  <Link 
                    to="/activity"
                    className="p-2 rounded-full text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0] transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                  </Link>
                )}
                {canAccess('upload') && (
                  <Link
                    to="/upload"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePath('/upload')
                        ? 'text-[#B7410E] bg-[#FAF3E0]'
                        : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0]'
                    }`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Link>
                )}
                <Link
                  to="/profile"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath('/profile')
                      ? 'text-[#B7410E] bg-[#FAF3E0]'
                      : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0]'
                  }`}
                >
                  <User className="h-4 w-4 mr-2" />
                  {currentUser.displayName || 'Profile'}
                </Link>
                {canAccess('settings') && (
                  <Link
                    to="/settings"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePath('/settings')
                        ? 'text-[#B7410E] bg-[#FAF3E0]'
                        : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0]'
                    }`}
                  >
                    Settings
                  </Link>
                )}
                {!isPremium() && (
                  <Link
                    to="/settings"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 transition-colors"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade
                  </Link>
                )}
                {isAdmin() && (
                  <span className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600">
                    <User className="h-4 w-4 mr-2" />
                    Admin
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#2D2D2D] hover:text-[#B7410E] hover:bg-[#FAF3E0] transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#2D2D2D] hover:text-[#B7410E] hover:bg-[#FAF3E0] transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-[#B7410E] hover:bg-[#8B5E3C] transition-colors"
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
            >
              <span className="sr-only">Open main menu</span>
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-secondary-200">
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
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchModalOpen(true);
                  }}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0] w-full text-left"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </button>
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
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActivePath('/profile')
                      ? 'text-[#B7410E] bg-[#FAF3E0]'
                      : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0]'
                  }`}
                >
                  <User className="h-5 w-5 mr-2" />
                  {currentUser.displayName || 'Profile'}
                </Link>
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
                {!isPremium() && (
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 transition-colors"
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Upgrade to Premium
                  </Link>
                )}
                {isAdmin() && (
                  <div className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-red-500 to-red-600">
                    <User className="h-5 w-5 mr-2" />
                    Admin
                  </div>
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
