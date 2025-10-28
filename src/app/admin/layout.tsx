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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Back to Home Button */}
              <Link
                href="/"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                title="Back to Home Page"
              >
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Link>
              
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
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
