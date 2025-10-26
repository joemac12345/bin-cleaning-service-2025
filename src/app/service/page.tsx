'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ServicePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the postcode checker page
    router.push('/postcode');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
