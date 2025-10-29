'use client';

import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import AdminNavigation from '@/components/AdminNavigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-zinc-800 shadow-sm border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Back to Home Button */}
              <Link
                href="/"
                className="inline-flex items-center px-3 py-2 border border-zinc-300 dark:border-zinc-600 shadow-sm text-sm leading-4 font-medium rounded-md text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-colors"
                title="Back to Home Page"
              >
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Link>
              
              <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">
                Admin Panel
              </h1>
            </div>
            
            {/* Navigation Menu */}
            <AdminNavigation />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
