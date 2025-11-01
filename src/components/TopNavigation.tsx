'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Home, Calendar, Clock } from 'lucide-react';

// Navigation pages configuration
// Add new pages here and they'll automatically appear in the navigation
const navigationPages = [
  { href: '/landing', label: 'Home', icon: Home },
  { href: '/booking', label: 'Book Now', icon: Calendar },
  { href: '/waitlist', label: 'Waitlist', icon: Clock },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export default function TopNavigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Navigation Carousel */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200/50 z-50 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1">
          {navigationPages.map((page) => {
            const IconComponent = page.icon;
            const isActive = pathname === page.href;
            
            return (
              <Link
                key={page.href}
                href={page.href}
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



      {/* Spacer to prevent content overlap */}
      <div className="h-16"></div> {/* Space for navigation carousel */}
    </>
  );
}
