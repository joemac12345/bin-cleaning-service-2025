'use client';

import { useRouter } from 'next/navigation';
import TopNavigation from '@/components/TopNavigation';
import { PostcodeChecker } from '@/components/postcode-manager';

export default function PostcodeCheckerPage() {
  const router = useRouter();

  const handleServiceAvailable = (postcode: string) => {
    // Redirect to booking form with postcode as query parameter
    router.push(`/booking?postcode=${encodeURIComponent(postcode)}`);
  };

  const handleWaitlist = (postcode: string) => {
    // Redirect to waitlist page with postcode as query parameter
    router.push(`/waitlist?postcode=${encodeURIComponent(postcode)}`);
  };

  return (
    <>
      <TopNavigation />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-12 w-full">
          <div className="text-6xl mb-4 animate-bounce">🗑️</div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent mb-3">
            Let's check your area
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl">
            See if we clean bins in your postcode
          </p>
        </div>

        {/* Main Component */}
        <div className="flex justify-center">
          <PostcodeChecker 
            onServiceAvailable={handleServiceAvailable}
            onWaitlist={handleWaitlist}
          />
        </div>
      </div>
      </div>
    </>
  );
}
