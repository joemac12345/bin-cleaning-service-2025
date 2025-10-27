import { Metadata } from 'next';
import Link from 'next/link';
import { Package, MapPin, Calendar, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Bin Cleaning',
  description: 'Manage bookings, service areas, and customer data for bin cleaning services',
};

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Available Admin Tools</h2>
          <p className="text-gray-600">Manage your bin cleaning service with these administrative tools.</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bookings Management */}
          <Link href="/admin/bookings" className="group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group-hover:border-blue-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                    Bookings Management
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    View, edit, and manage customer bookings
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-blue-600 group-hover:text-blue-700">
                  Manage bookings →
                </span>
              </div>
            </div>
          </Link>

          {/* Postcode Manager */}
          <Link href="/admin/postcode-manager" className="group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group-hover:border-green-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600">
                    Postcode Manager
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage service areas and validate postcodes
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 group-hover:text-green-700">
                  Manage postcodes →
                </span>
              </div>
            </div>
          </Link>

          {/* Abandoned Forms */}
          <Link href="/admin/abandoned-forms" className="group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group-hover:border-orange-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-orange-600">
                    Abandoned Forms
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Track and convert incomplete bookings
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-orange-600 group-hover:text-orange-700">
                  View abandoned forms →
                </span>
              </div>
            </div>
          </Link>

          {/* Database Setup */}
          <Link href="/admin/supabase-setup" className="group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group-hover:border-indigo-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                    Database Setup
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Configure Supabase database connection
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-indigo-600 group-hover:text-indigo-700">
                  Setup database →
                </span>
              </div>
            </div>
          </Link>

          {/* Email Settings */}
          <Link href="/admin/settings" className="group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group-hover:border-purple-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Configure Gmail SMTP for booking confirmations
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-purple-600 group-hover:text-purple-700">
                  Configure emails →
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Overview</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600">
              Welcome to your admin dashboard. Use the Bookings Management section to view and manage customer bookings.
            </p>
          </div>
        </div>
      </div>
  );
}
