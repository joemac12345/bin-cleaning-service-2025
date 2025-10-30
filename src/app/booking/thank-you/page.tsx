'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CheckCircle, Mail, Calendar, Phone, Home, ArrowLeft, Clock } from 'lucide-react';

// Component that uses searchParams - must be wrapped in Suspense
function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    // Get booking reference safely on client side only
    const ref = searchParams.get('ref') || 'BIN-' + Date.now().toString().slice(-6);
    setBookingRef(ref);
  }, [searchParams]);

  const handleBackToHome = () => {
    router.push('/');
  };

  const nextSteps = [
    {
      icon: Mail,
      title: "Email Confirmation",
      description: "You'll receive an email confirmation with your booking details shortly. Please keep this for your records.",
      number: "1"
    },
    {
      icon: Phone,
      title: "Contact Within 24 Hours",
      description: "Our team will contact you within 24 hours to confirm your service and arrange a convenient time.",
      number: "2"
    },
    {
      icon: Calendar,
      title: "Service Scheduled",
      description: "We'll schedule your bin cleaning service and notify you before we arrive to clean your bins.",
      number: "3"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Corporate Flat */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-start space-x-4 md:space-x-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Booking Confirmed
              </h1>
              <p className="text-base md:text-lg text-gray-600 mb-4">
                Your bin cleaning service has been successfully scheduled
              </p>
              {bookingRef && (
                <div className="inline-block bg-blue-50 border border-blue-600 px-4 py-2">
                  <p className="text-sm font-semibold text-gray-900">
                    Reference: <span className="text-blue-600">{bookingRef}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Next Steps - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                What Happens Next
              </h2>
              
              <div className="space-y-6">
                {nextSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-600 flex items-center justify-center">
                          <span className="text-white text-lg font-bold">{step.number}</span>
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="text-base font-bold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-white border border-gray-300 p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Clock className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-2">
                    Important Information
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Please ensure your bins are accessible on the scheduled service day. 
                    We'll send you a reminder 24 hours before your service.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6 sticky top-4">
              <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleBackToHome}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </button>
                
                <button
                  onClick={() => router.push('/booking')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold transition-colors hover:bg-gray-50"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Book Another Service
                </button>
              </div>

              {/* Contact Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3">
                  Need Help?
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-blue-600" />
                    Call us: 0800 123 4567
                  </p>
                  <p className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-blue-600" />
                    info@binclean.co.uk
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 border border-blue-200 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            Confirmation Email Sent
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            A confirmation email has been sent to your registered email address with all the details of your booking. 
            If you don't receive it within the next few minutes, please check your spam folder or contact us directly.
          </p>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function ThankYouLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-start space-x-4 md:space-x-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 flex items-center justify-center animate-pulse">
                <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Loading...
              </h1>
              <p className="text-base md:text-lg text-gray-600">
                Please wait while we load your booking confirmation
              </p>
            </div>
          </div>
        </div>
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
