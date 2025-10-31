import { Metadata } from 'next';
import Link from 'next/link';
import { Package, MapPin, Calendar, Users, UserX, Clock, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Bin Cleaning',
  description: 'Manage bookings, service areas, and customer data for bin cleaning services',
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Cards - Enhanced Design */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Bookings Management */}
          <Link href="/admin/bookings" className="group">
            <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6 hover:border-blue-400 transition-all hover:shadow-lg hover:shadow-blue-900/20 h-[220px] flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Package className="h-8 w-8 text-blue-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white">
                    Bookings Management
                  </h3>
                  <p className="text-sm text-zinc-400 mt-2">
                    View, edit, and manage customer bookings
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center text-sm text-blue-400 font-medium group-hover:gap-2 transition-all mt-auto">
                <span>Manage bookings</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Postcode Manager */}
          <Link href="/admin/postcode-manager" className="group">
            <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6 hover:border-green-400 transition-all hover:shadow-lg hover:shadow-green-900/20 h-[220px] flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <MapPin className="h-8 w-8 text-green-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white">
                    Postcode Manager
                  </h3>
                  <p className="text-sm text-zinc-400 mt-2">
                    Manage service areas and validate postcodes
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center text-sm text-green-400 font-medium group-hover:gap-2 transition-all mt-auto">
                <span>Manage postcodes</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Abandoned Forms - Contact Tracking */}
          <Link href="/admin/abandoned-forms" className="group">
            <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6 hover:border-red-400 transition-all hover:shadow-lg hover:shadow-red-900/20 h-[220px] flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <UserX className="h-8 w-8 text-red-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white">
                    Abandoned Forms
                  </h3>
                  <p className="text-sm text-zinc-400 mt-2">
                    Recovery leads with email & phone tracking
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center text-sm text-red-400 font-medium group-hover:gap-2 transition-all mt-auto">
                <span>Manage contacts</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Waitlist Viewer */}
          <Link href="/admin/waitlist" className="group">
            <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-900/20 h-[220px] flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Clock className="h-8 w-8 text-cyan-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white">
                    Waitlist Viewer
                  </h3>
                  <p className="text-sm text-zinc-400 mt-2">
                    View service expansion leads and contacts
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center text-sm text-cyan-400 font-medium group-hover:gap-2 transition-all mt-auto">
                <span>View waitlist</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Email Templates Preview */}
          <Link href="/admin/email-preview" className="group">
            <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6 hover:border-purple-400 transition-all hover:shadow-lg hover:shadow-purple-900/20 h-[220px] flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Mail className="h-8 w-8 text-purple-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white">
                    Email Templates
                  </h3>
                  <p className="text-sm text-zinc-400 mt-2">
                    Preview and manage email templates
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center text-sm text-purple-400 font-medium group-hover:gap-2 transition-all mt-auto">
                <span>View templates</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Overview</h2>
          <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6">
            <div className="space-y-3">
              <p className="text-zinc-400">
                Welcome to your admin dashboard. Manage all aspects of your bin cleaning service from here.
              </p>
              <div className="flex items-start gap-3 pt-3 border-t border-zinc-700">
                <UserX className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm">New: Contact Tracking System</p>
                  <p className="text-zinc-400 text-sm mt-1">
                    Abandoned Forms now includes manual email sending, phone call logging, and email open tracking to help you recover more leads.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
