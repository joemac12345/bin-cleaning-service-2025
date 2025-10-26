'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
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
    <div>
      <BookingForm 
        postcode={postcode}
        onBack={handleBack}
      />
    </div>
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
