import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Search, Heart } from 'lucide-react';
import SearchModal from './SearchModal';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const location = useLocation();

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
            <button 
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 rounded-full text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0] transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link 
              to="/activity"
              className="p-2 rounded-full text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0] transition-colors"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              to="/profile"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath('/profile')
                  ? 'text-[#B7410E] bg-[#FAF3E0]'
                  : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0]'
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
            <Link
              to="/settings"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath('/settings')
                  ? 'text-[#B7410E] bg-[#FAF3E0]'
                  : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0]'
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              Settings
            </Link>
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
              Profile
            </Link>
            <Link
              to="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActivePath('/settings')
                  ? 'text-[#B7410E] bg-[#FAF3E0]'
                  : 'text-[#2D2D2D] hover:text-[#D4AF37] hover:bg-[#FAF3E0]'
              }`}
            >
              <User className="h-5 w-5 mr-2" />
              Settings
            </Link>
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
