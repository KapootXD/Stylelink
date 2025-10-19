import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-secondary-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-primary-600 mb-4">
              StyleLink
            </div>
            <p className="text-secondary-600 text-sm mb-4 max-w-md">
              Connect global fashion with local creativity. Discover authentic styles worldwide 
              and support local brands through our platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-secondary-600 hover:text-primary-600 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/discover" className="text-secondary-600 hover:text-primary-600 text-sm transition-colors">
                  Discover
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-secondary-600 hover:text-primary-600 text-sm transition-colors">
                  Results
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-600 hover:text-primary-600 text-sm transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-secondary-600 hover:text-primary-600 text-sm transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-600 text-sm transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-600 text-sm transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-8 pt-8 border-t border-secondary-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-500 text-sm">
              © 2024 StyleLink. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-secondary-500 hover:text-primary-600 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-secondary-500 hover:text-primary-600 text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
