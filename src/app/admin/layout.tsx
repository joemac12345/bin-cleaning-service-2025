'use client';

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
            <div className="flex items-center">
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
