'use client';

import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Top Navigation Bar */}
      <div className="bg-zinc-800 shadow-sm border-b border-zinc-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Back to Home Button */}
              <Link
                href="/"
                className="inline-flex items-center px-3 py-2 border border-zinc-600 shadow-sm text-sm leading-4 font-medium rounded-md text-zinc-300 bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
                title="Back to Home Page"
              >
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Link>
              
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Admin Panel
              </h1>
            </div>
            
            {/* Back to Dashboard Button */}
            <Link
              href="/admin"
              className="inline-flex items-center px-4 py-2 border border-zinc-600 shadow-sm text-sm leading-4 font-medium rounded-md text-zinc-300 bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
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
