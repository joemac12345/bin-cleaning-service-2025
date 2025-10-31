'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CheckCircle, Mail, Calendar, Phone, Home, Sparkles, Clock, Bell } from 'lucide-react';
import PageHeader, { BookingReference } from '@/components/PageHeader';

// Component that uses searchParams - must be wrapped in Suspense
function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    // Get booking reference safely on client side only
    const bookingId = searchParams.get('booking');
    const refId = searchParams.get('ref');
    const ref = bookingId || refId || 'BIN-' + Date.now().toString().slice(-6);
    setBookingRef(ref);
  }, [searchParams]);

  const nextSteps = [
    {
      icon: Mail,
      title: "Check Your Email",
      description: "We've sent a confirmation to your inbox with all the booking details",
      color: "blue",
      number: "1"
    },
    {
      icon: Phone,
      title: "We'll Call You",
      description: "Our team will contact you within 24 hours to schedule your service",
      color: "green",
      number: "2"
    },
    {
      icon: Calendar,
      title: "Service Day",
      description: "We'll arrive at your scheduled time to clean your bins",
      color: "purple",
      number: "3"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Success Hero Section - Compact, Left-Aligned */}
      <PageHeader
        icon={CheckCircle}
        title="Booking Confirmed"
        subtitle="Thank you for your booking"
        variant="success"
      >
        {/* Booking Reference - Below confirmation */}
        {bookingRef && <BookingReference reference={bookingRef} />}
      </PageHeader>

      {/* Main Content */}
      <div className="px-4 py-8 max-w-3xl mx-auto">
        {/* Quick Actions - Carousel */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">
            Quick Helpful Links
          </h2>
          <div className="h-px bg-gray-200 mb-4"></div>
          
          <div className="-mx-4 px-4">
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
              <button
                onClick={() => router.push('/')}
                className="flex-shrink-0 w-28 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 text-xs transition-colors flex items-center justify-center gap-1.5 snap-start"
              >
                <Home className="w-3.5 h-3.5" strokeWidth={2} />
                Home
              </button>
              
              <button
                onClick={() => router.push('/booking')}
                className="flex-shrink-0 w-28 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 text-xs transition-colors flex items-center justify-center gap-1.5 snap-start"
              >
                Book Again
              </button>

              <a
                href="tel:08001234567"
                className="flex-shrink-0 w-28 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 text-xs transition-colors flex items-center justify-center gap-1.5 snap-start"
              >
                <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                Call Us
              </a>

              <a
                href="https://wa.me/447000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-28 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 text-xs transition-colors flex items-center justify-center gap-1.5 snap-start"
              >
                <Mail className="w-3.5 h-3.5" strokeWidth={2} />
                WhatsApp
              </a>

              <a
                href="mailto:info@binclean.co.uk"
                className="flex-shrink-0 w-28 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 text-xs transition-colors flex items-center justify-center gap-1.5 snap-start"
              >
                <Mail className="w-3.5 h-3.5" strokeWidth={2} />
                Email Us
              </a>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Next Steps
          </h2>
          
          <div className="space-y-4">
            {nextSteps.map((step, index) => {
              return (
                <div
                  key={index}
                  className="bg-gray-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-gray-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {step.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Important Reminder */}
        <div className="bg-gray-900 text-white p-4 mb-8">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 mt-0.5 flex-shrink-0" strokeWidth={2} />
            <div>
              <h3 className="font-bold mb-1">Important Reminder</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Please ensure your bins are accessible on the scheduled service day. We'll send you a reminder 24 hours in advance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function ThankYouLoading() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-200 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-blue-700" />
        </div>
        <p className="text-gray-900 font-bold">Loading confirmation...</p>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function ThankYouPage() {
  return (
    <Suspense fallback={<ThankYouLoading />}>
      <ThankYouContent />
    </Suspense>
  );
}
