'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Home, 
  Package, 
  Users, 
  BarChart3,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: BarChart3,
    description: 'Overview and key metrics'
  },
  {
    name: 'Bookings',
    href: '/admin/bookings',
    icon: Package,
    description: 'Manage customer bookings'
  },
  {
    name: 'Abandoned Forms',
    href: '/admin/abandoned-forms',
    icon: Users,
    description: 'Follow up with incomplete bookings'
  },
  {
    name: 'Postcode Manager',
    href: '/admin/postcode-manager',
    icon: MapPin,
    description: 'Manage service areas and demand'
  },
  {
    name: 'Back to Home',
    href: '/',
    icon: Home,
    description: 'Return to main website'
  }
];

interface AdminNavigationProps {
  className?: string;
}

export default function AdminNavigation({ className = '' }: AdminNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className={`relative ${className}`}>
        <button
          onClick={toggleMenu}
          className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open admin menu</span>
          {isOpen ? (
            <X className="block h-6 w-6" />
          ) : (
            <Menu className="block h-6 w-6" />
          )}
        </button>
      </div>

      {/* Full Screen Overlay & Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Full Width Navigation Modal */}
      <div className={`
        fixed inset-0 z-50 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        <div className={`
          absolute inset-0 bg-white dark:bg-zinc-900 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : '-translate-y-full'}
        `}>
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-black to-zinc-800 dark:from-zinc-950 dark:to-black">
            <div className="flex items-center justify-between px-6 py-6">
              <h2 className="text-2xl font-bold text-white">Admin Menu</h2>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg text-zinc-300 hover:bg-zinc-700 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="max-h-[calc(100vh-140px)] overflow-y-auto">
            <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isBackToHome = item.href === '/';
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMenu}
                    className={`
                      flex items-center justify-between px-6 py-5 transition-all
                      ${isBackToHome
                        ? 'bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 border-l-4 border-green-500'
                        : isActive
                          ? 'bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 border-l-4 border-blue-500'
                          : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 border-l-4 border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <Icon className={`
                        h-6 w-6 mr-4 flex-shrink-0
                        ${isBackToHome
                          ? 'text-green-600 dark:text-green-400'
                          : isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-zinc-400 dark:text-zinc-500'
                        }
                      `} />
                      <div className="flex-1 min-w-0">
                        <div className={`
                          text-lg font-medium
                          ${isBackToHome
                            ? 'text-green-700 dark:text-green-300'
                            : isActive
                              ? 'text-blue-700 dark:text-blue-300'
                              : 'text-zinc-900 dark:text-white'
                          }
                        `}>
                          {item.name}
                        </div>
                        {item.description && (
                          <div className={`
                            text-sm mt-1
                            ${isBackToHome
                              ? 'text-green-600 dark:text-green-400'
                              : isActive
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-zinc-500 dark:text-zinc-400'
                            }
                          `}>
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`
                      h-5 w-5 ml-4 flex-shrink-0 transition-transform
                      ${isBackToHome
                        ? 'text-green-600 dark:text-green-400'
                        : isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-zinc-300 dark:text-zinc-600'
                      }
                    `} />
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-50 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 px-6 py-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
              Bin Cleaning Admin Panel v1.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
