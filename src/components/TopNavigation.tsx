'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

export default function TopNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-50 via-white to-slate-50 shadow-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left Side */}
            <div className="flex-shrink-0">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Logo size="small" />
              </Link>
            </div>

            {/* Spacer for mobile */}
            <div className="flex-1"></div>

            {/* Hamburger Menu - Right Side */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-16 bg-black/50 z-40" onClick={() => setIsOpen(false)}>
          <div
            className="absolute top-16 right-0 bg-white shadow-lg max-w-xs w-full sm:w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-6 space-y-4">
              {/* Admin Link */}
              <Link
                href="/admin"
                className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span>🔧</span>
                <span className="ml-3">Admin Dashboard</span>
              </Link>

              {/* Divider */}
              <div className="border-t border-slate-200"></div>

              {/* Customer Pages Quick Links */}
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2">
                Quick Links
              </div>
              
              <Link
                href="/"
                className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                🏠
                <span className="ml-3">Home</span>
              </Link>

              <Link
                href="/postcode"
                className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                📍
                <span className="ml-3">Check Service Area</span>
              </Link>

              <Link
                href="/booking"
                className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                📅
                <span className="ml-3">Book Now</span>
              </Link>

              <Link
                href="/waitlist"
                className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                ⏰
                <span className="ml-3">Join Waitlist</span>
              </Link>

              {/* Divider */}
              <div className="border-t border-slate-200"></div>

              {/* Close Button Mobile */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content overlap */}
      <div className="h-16"></div>
    </>
  );
}
