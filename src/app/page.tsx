'use client';

import { useRouter } from 'next/navigation';
import { PostcodeChecker } from '@/components/postcode-manager';

export default function HomePage() {
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
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-repeat"
        style={{
          backgroundImage: "url('/Backround grey.png')",
          backgroundSize: "300px 300px", // Adjust size as needed
        }}
      />
      
      {/* Wallpaper Opacity Overlay */}
      <div className="absolute inset-0 bg-white/60" />
      
      {/* Admin Link */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => router.push('/admin/bookings')}
          className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200 hover:underline"
        >
          Admin
        </button>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Main Content */}
        <div className="flex justify-center">
          <PostcodeChecker 
            onServiceAvailable={handleServiceAvailable}
            onWaitlist={handleWaitlist}
          />
        </div>
      </div>
    </div>
  );
}
