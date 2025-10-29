'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import TopNavigation from '@/components/TopNavigation';
import BookingForm from '@/components/BookingForm';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postcode = searchParams.get('postcode') || '';

  const handleBack = () => {
    router.push('/postcode');
  };

  // If no postcode is provided, redirect to postcode checker
  useEffect(() => {
    if (!postcode) {
      router.push('/postcode');
    }
  }, [postcode, router]);

  // Don't render the form if there's no postcode
  if (!postcode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to postcode checker...</p>
      </div>
    );
  }

  return (
    <>
      <TopNavigation />
      <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Background Image - same as postcode page */}
      <div 
        className="absolute inset-0 bg-repeat"
        style={{
          backgroundImage: "url('/Backround grey.png')",
          backgroundSize: "300px 300px",
        }}
      />
      
      {/* Wallpaper Opacity Overlay */}
      <div className="absolute inset-0 bg-white/60" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl my-8 flex flex-col items-center">

        <BookingForm 
          postcode={postcode}
          onBack={handleBack}
        />
      </div>
      </div>
    </>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div>
        <p>Loading booking form...</p>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
