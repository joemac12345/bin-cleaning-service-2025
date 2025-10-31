'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Facebook, Instagram, Twitter, Phone } from 'lucide-react';
import Logo from './Logo';

export default function TopNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200/50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo - Left Side */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image 
                  src="/3.png" 
                  alt="Bin Cleaning Service" 
                  width={180} 
                  height={180}
                  className="object-contain"
                />
              </Link>
            </div>

            {/* Right Side - Social Icons and Button */}
            <div className="flex items-center gap-4">
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-pink-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-blue-400 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>

              {/* Book Now Button */}
              <Link
                href="/booking"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Book Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-24 bg-black/50 z-40" onClick={() => setIsOpen(false)}>
          <div
            className="absolute top-24 right-0 bg-white shadow-lg max-w-xs w-full sm:w-80"
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
      <div className="h-24"></div>
    </>
  );
}
