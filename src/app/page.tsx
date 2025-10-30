/**
 * HOME PAGE - Main Landing Page (/)
 * ===================================
 * 
 * This is the PRIMARY ENTRY POINT for your bin cleaning service website.
 * Users land here first when visiting your domain.
 * 
 * Core Purpose:
 * - Postcode-based service area validation
 * - Route qualified users to booking form
 * - Capture leads via waitlist for unsupported areas
 * - Provide admin access for business management
 * 
 * User Journey Flow:
 * 1. User enters postcode in PostcodeChecker component
 * 2. System checks against Supabase service areas database
 * 3a. SERVICE AVAILABLE → Redirect to /booking with postcode pre-filled
 * 3b. NO SERVICE YET → Redirect to /waitlist for future expansion
 * 
 * Business Logic:
 * - Acts as qualification funnel (can we serve this customer?)
 * - Captures expansion opportunities (waitlist signups)
 * - Maximizes conversion by pre-filling booking forms
 * - Provides discrete admin access for business owners
 * 
 * Design Philosophy:
 * - TikTok-inspired clean, minimal interface
 * - Mobile-first responsive design
 * - Single focused action (postcode entry)
 * - No distractions from primary conversion goal
 * 
 * Technical Notes:
 * - Must be named 'page.tsx' for Next.js App Router (routes to '/')
 * - Uses client-side routing for smooth navigation
 * - Background image consistent with brand identity
 * - Admin link positioned discretely (top-right corner)
 */

'use client';

import { useRouter } from 'next/navigation';
import TopNavigation from '@/components/TopNavigation';
import { PostcodeChecker } from '@/components/postcode-manager';

export default function HomePage() {
  const router = useRouter();

  // SUCCESS HANDLER: Service Available in User's Area
  // =================================================
  // Triggered when PostcodeChecker finds user's postcode in service areas database
  // Pre-fills booking form with validated postcode for smooth user experience
  const handleServiceAvailable = (postcode: string) => {
    // Redirect to booking form with postcode as query parameter
    router.push(`/booking?postcode=${encodeURIComponent(postcode)}`);
  };

  // WAITLIST HANDLER: Service Not Available Yet
  // ===========================================
  // Triggered when user's postcode is not in current service areas
  // Captures lead for future business expansion into new areas
  const handleWaitlist = (postcode: string) => {
    // Redirect to waitlist page with postcode as query parameter
    router.push(`/waitlist?postcode=${encodeURIComponent(postcode)}`);
  };

  return (
    <>
      <TopNavigation />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
          {/* Header Section */}
          <div className="bg-blue-600 px-6 py-8">
            <div className="w-16 h-16 bg-white mb-4 flex items-center justify-center">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">
              Professional Bin Cleaning Service
            </h1>
            <p className="text-blue-100 text-sm">
              Check service availability in your area
            </p>
          </div>

          {/* Content Section */}
          <div className="flex-1 px-6 py-6 overflow-y-auto">
            {/* Info Box */}
            <div className="bg-gray-100 border border-gray-200 px-4 py-4 mb-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                Enter your postcode to verify service availability and access our marketplace platform.
              </p>
            </div>

            {/* PostcodeChecker Component */}
            <div className="mb-6">
              <PostcodeChecker 
                onServiceAvailable={handleServiceAvailable}
                onWaitlist={handleWaitlist}
              />
            </div>
          </div>
        </div>

        {/* Admin Access - Bottom Corner */}
        <div className="fixed bottom-4 right-4 z-20">
          <button
            onClick={() => router.push('/admin/bookings')}
            className="w-12 h-12 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 flex items-center justify-center transition-colors"
            title="Admin Dashboard"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
