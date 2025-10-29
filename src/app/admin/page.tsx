import { Metadata } from 'next';
import Link from 'next/link';
import { Package, MapPin, Calendar, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Bin Cleaning',
  description: 'Manage bookings, service areas, and customer data for bin cleaning services',
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-zinc-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-zinc-300 mt-2">Manage your bin cleaning service with these powerful admin tools</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Available Tools</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Access key administration features for managing your service</p>
        </div>

        {/* Dashboard Cards - Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Bookings Management */}
          <Link href="/admin/bookings" className="group">
            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-lg dark:hover:shadow-blue-900/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Package className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-3" />
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Bookings Management
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                    View, edit, and manage customer bookings
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
                <span>Manage bookings</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Postcode Manager */}
          <Link href="/admin/postcode-manager" className="group">
            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:border-green-400 dark:hover:border-green-500 transition-all hover:shadow-lg dark:hover:shadow-green-900/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <MapPin className="h-8 w-8 text-green-600 dark:text-green-400 mb-3" />
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Postcode Manager
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                    Manage service areas and validate postcodes
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center text-sm text-green-600 dark:text-green-400 font-medium group-hover:gap-2 transition-all">
                <span>Manage postcodes</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Abandoned Forms */}
          <Link href="/admin/abandoned-forms" className="group">
            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:border-amber-400 dark:hover:border-amber-500 transition-all hover:shadow-lg dark:hover:shadow-amber-900/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Users className="h-8 w-8 text-amber-600 dark:text-amber-400 mb-3" />
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Abandoned Forms
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                    Track and convert incomplete bookings
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center text-sm text-amber-600 dark:text-amber-400 font-medium group-hover:gap-2 transition-all">
                <span>View forms</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Database Setup */}
          <Link href="/admin/supabase-setup" className="group">
            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all hover:shadow-lg dark:hover:shadow-indigo-900/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Database Setup
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                    Configure Supabase database connection
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 font-medium group-hover:gap-2 transition-all">
                <span>Setup database</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Email Settings */}
          <Link href="/admin/settings" className="group">
            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:shadow-lg dark:hover:shadow-purple-900/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <svg className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                    Configure Gmail SMTP for booking confirmations
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center text-sm text-purple-600 dark:text-purple-400 font-medium group-hover:gap-2 transition-all">
                <span>Configure emails</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Quick Overview</h2>
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <p className="text-zinc-600 dark:text-zinc-400">
              Welcome to your admin dashboard. Use the Bookings Management section to view and manage customer bookings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
