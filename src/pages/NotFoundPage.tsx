import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <main
      className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4 py-16"
      aria-labelledby="not-found-heading"
    >
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#B7410E] uppercase tracking-widest">
            Error 404
          </p>
          <h1
            id="not-found-heading"
            className="text-4xl sm:text-5xl font-bold text-gray-900"
          >
            Oops! Page not found
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Sorry, we can't find the page you're looking for. The link may be broken,
            the page may have been moved, or it might never have existed.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="p-5 rounded-xl bg-white shadow-sm border border-gray-100 text-left space-y-2">
            <p className="text-base font-semibold text-gray-900">Check the URL</p>
            <p className="text-sm text-gray-600">
              Make sure the web address is spelled correctly, or try a shorter path closer to the
              homepage.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-white shadow-sm border border-gray-100 text-left space-y-2">
            <p className="text-base font-semibold text-gray-900">Need help?</p>
            <p className="text-sm text-gray-600">
              You can return to the homepage or reach out to our support team if you think this is a mistake.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#B7410E] text-white font-semibold rounded-lg hover:bg-[#8B5E3C] transition-colors shadow-sm"
          >
            Go Home
          </Link>
          <Link
            to="/support"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#B7410E] text-[#B7410E] font-semibold rounded-lg hover:bg-[#FAF3E0] transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
