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
    <div className="min-h-screen relative flex items-center justify-center px-4">
      
      {/* Page Background Layer */}
      {/* ===================== */}
      {/* Brand-consistent background image that tiles across entire viewport */}
      {/* Note: This overrides the layout.tsx wallpaper for this specific page */}
      <div 
        className="absolute inset-0 bg-repeat"
        style={{
          backgroundImage: "url('/Backround grey.png')", // Brand background pattern
          backgroundSize: "300px 300px",                 // Tile size for optimal display
        }}
      />
      

      
      {/* Admin Access Portal */}
      {/* ================== */}
      {/* Discrete admin link for business owners - positioned to avoid customer confusion */}
      {/* Routes directly to booking management dashboard */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => router.push('/admin/bookings')}
          className="text-gray-600 hover:text-blue-600 p-2 rounded-full transition-colors duration-200 hover:bg-gray-100"
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
          >
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>
      
      {/* Main Content Container */}
      {/* ===================== */}
      {/* Centered layout focuses user attention on primary conversion action */}
      <div className="relative z-10 w-full max-w-4xl">
        
        {/* Primary Conversion Element */}
        {/* ========================= */}
        {/* PostcodeChecker is the CORE business logic component */}
        {/* - Validates service availability */}
        {/* - Routes to booking or waitlist */}
        {/* - Connects to Supabase service areas database */}
        <div className="flex justify-center">
          <PostcodeChecker 
            onServiceAvailable={handleServiceAvailable}  // → /booking?postcode=XX
            onWaitlist={handleWaitlist}                   // → /waitlist?postcode=XX
          />
        </div>
      </div>
    </div>
  );
}
