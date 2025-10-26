'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Home, 
  Package, 
  Calendar, 
  Users, 
  Settings, 
  BarChart3,
  MapPin,
  FileText,
  CreditCard
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
    icon: Home,
    description: 'Overview and statistics'
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
    description: 'Track and convert incomplete bookings'
  },
  {
    name: 'Postcode Manager',
    href: '/admin/postcode-manager',
    icon: MapPin,
    description: 'Manage service areas'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Configure system settings'
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
      <div className={`relative md:hidden ${className}`}>
        <button
          onClick={toggleMenu}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <X className="block h-6 w-6" />
          ) : (
            <Menu className="block h-6 w-6" />
          )}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Slide-out Navigation Panel */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-auto md:w-auto md:bg-transparent md:shadow-none
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
          <button
            onClick={closeMenu}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop Dropdown Menu */}
        <div className="hidden md:block relative">
          <button
            onClick={toggleMenu}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Menu className="h-4 w-4 mr-2" />
            Admin Menu
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="py-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMenu}
                      className={`
                        flex items-center px-4 py-3 text-sm transition-colors
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className={`
                        h-5 w-5 mr-3 
                        ${isActive ? 'text-blue-600' : 'text-gray-400'}
                      `} />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {item.description}
                          </div>
                        )}
                      </div>
                      {isActive && (
                        <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation Items */}
        <nav className="flex-1 px-2 py-4 space-y-1 md:hidden max-h-screen overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className={`
                  flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`
                  h-6 w-6 mr-4 
                  ${isActive ? 'text-blue-600' : 'text-gray-400'}
                `} />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  )}
                </div>
                {isActive && (
                  <div className="ml-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer for Mobile */}
        <div className="p-4 border-t border-gray-200 md:hidden">
          <div className="text-xs text-gray-500 text-center">
            Bin Cleaning Admin Panel
          </div>
        </div>
      </div>
    </>
  );
}
