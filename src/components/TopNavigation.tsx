'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Home, Calendar, Clock } from 'lucide-react';

// Navigation pages configuration
// Add new pages here and they'll automatically appear in the navigation
const navigationPages = [
  { href: '/landing', label: 'Home', icon: Home },
  { href: '/booking', label: 'Book Now', icon: Calendar },
  { href: '/waitlist', label: 'Waitlist', icon: Clock },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export default function TopNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200/50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-24">
            {/* Navigation Carousel - Desktop */}
            <div className="hidden md:flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1">
              {navigationPages.map((page) => {
                const IconComponent = page.icon;
                const isActive = pathname === page.href;
                
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    className={`flex-none snap-start px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#3B4044] text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-sm'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{page.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Carousel */}
      <div className="md:hidden fixed top-24 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200/50 z-40 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1">
          {navigationPages.map((page) => {
            const IconComponent = page.icon;
            const isActive = pathname === page.href;
            
            return (
              <Link
                key={page.href}
                href={page.href}
                onClick={() => setIsOpen(false)}
                className={`flex-none snap-start px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#3B4044] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{page.label}</span>
              </Link>
            );
          })}
        </div>
        
        {/* Scroll Hint */}
        <div className="flex justify-center gap-1 mt-2">
          {navigationPages.map((_, index) => (
            <div key={index} className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-24 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)}>
          <div
            className="absolute top-[116px] right-0 bg-white shadow-lg max-w-xs w-full"
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
      <div className="h-24 md:h-24"></div>
      <div className="h-16 md:hidden"></div> {/* Extra space for mobile carousel */}
    </>
  );
}
