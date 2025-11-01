import { Metadata } from 'next';
import Link from 'next/link';
import { Package, MapPin, Calendar, Users, UserX, Clock, Mail, Phone, Camera } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Bin Cleaning',
  description: 'Manage bookings, service areas, and customer data for bin cleaning services',
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage your bin cleaning service</p>
      </div>

      <div className="px-4 py-4">
        {/* Dashboard Cards - Mobile-First Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {/* Bookings Management */}
          <Link href="/admin/bookings" className="group">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 hover:border-blue-500 transition-all active:scale-95">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white">
                    Bookings Management
                  </h3>
                </div>
              </div>
              <p className="text-sm text-zinc-400 mb-3">
                View, edit, and manage customer bookings
              </p>
              <div className="inline-flex items-center text-sm text-blue-400 font-medium">
                <span>Manage bookings</span>
                <span className="ml-1">→</span>
              </div>
            </div>
          </Link>

          {/* Postcode Manager */}
          <Link href="/admin/postcode-manager" className="group">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 hover:border-green-500 transition-all active:scale-95">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white">
                    Postcode Manager
                  </h3>
                </div>
              </div>
              <p className="text-sm text-zinc-400 mb-3">
                Manage service areas and validate postcodes
              </p>
              <div className="inline-flex items-center text-sm text-green-400 font-medium">
                <span>Manage postcodes</span>
                <span className="ml-1">→</span>
              </div>
            </div>
          </Link>

          {/* Photo Gallery */}
          <Link href="/admin/photos" className="group">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 hover:border-purple-500 transition-all active:scale-95">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Camera className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white">
                    Photo Gallery
                  </h3>
                </div>
              </div>
              <p className="text-sm text-zinc-400 mb-3">
                Upload before & after photos for website gallery
              </p>
              <div className="inline-flex items-center text-sm text-purple-400 font-medium">
                <span>Manage photos</span>
                <span className="ml-1">→</span>
              </div>
            </div>
          </Link>

          {/* Abandoned Forms - Contact Tracking */}
          <Link href="/admin/abandoned-forms" className="group">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 hover:border-red-500 transition-all active:scale-95">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <UserX className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white">
                    Abandoned Forms
                  </h3>
                </div>
              </div>
              <p className="text-sm text-zinc-400 mb-3">
                Recovery leads with email & phone tracking
              </p>
              <div className="inline-flex items-center text-sm text-red-400 font-medium">
                <span>Manage contacts</span>
                <span className="ml-1">→</span>
              </div>
            </div>
          </Link>

          {/* Waitlist Viewer */}
          <Link href="/admin/waitlist" className="group">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 hover:border-cyan-500 transition-all active:scale-95">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white">
                    Waitlist Viewer
                  </h3>
                </div>
              </div>
              <p className="text-sm text-zinc-400 mb-3">
                View service expansion leads and contacts
              </p>
              <div className="inline-flex items-center text-sm text-cyan-400 font-medium">
                <span>View waitlist</span>
                <span className="ml-1">→</span>
              </div>
            </div>
          </Link>

          {/* Email Templates Preview */}
          <Link href="/admin/email-preview" className="group">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 hover:border-purple-500 transition-all active:scale-95">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white">
                    Email Templates
                  </h3>
                </div>
              </div>
              <p className="text-sm text-zinc-400 mb-3">
                Preview and manage email templates
              </p>
              <div className="inline-flex items-center text-sm text-purple-400 font-medium">
                <span>View templates</span>
                <span className="ml-1">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
          <h2 className="text-base font-semibold text-white mb-3">Quick Overview</h2>
          <p className="text-sm text-zinc-400 mb-3">
            Welcome to your admin dashboard. Manage all aspects of your bin cleaning service from here.
          </p>
          <div className="flex items-start gap-3 pt-3 border-t border-zinc-800">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <UserX className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">Contact Tracking System</p>
              <p className="text-zinc-400 text-xs mt-1">
                Track abandoned forms with email sending, call logging, and open tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
