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
    const bookingId = searchParams.get('booking');
    const refId = searchParams.get('ref');
    const ref = bookingId || refId || 'BIN-' + Date.now().toString().slice(-6);
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
      {/* Header Section - Friendly & Clear */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-700">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-12 h-12 md:w-14 md:h-14 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Thank You! Your Booking is Confirmed 🎉
          </h1>
          <p className="text-lg md:text-xl text-blue-50 mb-6 max-w-2xl mx-auto">
            We've received your bin cleaning request and we're excited to help keep your bins spotless!
          </p>
          {bookingRef && (
            <div className="inline-block bg-white rounded-lg px-6 py-3 shadow-md">
              <p className="text-sm text-gray-600 mb-1">Your Booking Reference</p>
              <p className="text-2xl font-bold text-blue-600">{bookingRef}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Next Steps - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What Happens Next? 📋
              </h2>
              <p className="text-gray-600 mb-8">
                Here's what you can expect over the next few days
              </p>
              
              <div className="space-y-8">
                {nextSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-start space-x-5">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                          <Icon className="w-7 h-7 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold mr-3">
                            {step.number}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed ml-9">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-700" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    📌 Important Reminder
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Please ensure your bins are accessible on the scheduled service day. 
                    We'll send you a reminder 24 hours before your service so you won't forget!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-4">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-5">
                  Quick Actions 🚀
                </h3>
                
                <div className="space-y-3">
                  <button
                    onClick={handleBackToHome}
                    className="w-full flex items-center justify-center px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Back to Home
                  </button>
                  
                  <button
                    onClick={() => router.push('/booking')}
                    className="w-full flex items-center justify-center px-5 py-3.5 bg-white border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold rounded-xl transition-all hover:shadow-md"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Book Another Service
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Need Help? 💬
                </h4>
                <p className="text-sm text-gray-700 mb-4">
                  Our friendly team is here to assist you!
                </p>
                <div className="space-y-3">
                  <a href="tel:08001234567" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Call us</p>
                      <p className="text-sm font-semibold text-gray-900">0800 123 4567</p>
                    </div>
                  </a>
                  <a href="mailto:info@binclean.co.uk" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Email us</p>
                      <p className="text-sm font-semibold text-gray-900">info@binclean.co.uk</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ✅ Confirmation Email Sent!
              </h3>
              <p className="text-gray-700 leading-relaxed">
                A confirmation email has been sent to your registered email address with all the details of your booking. 
                If you don't receive it within the next few minutes, please check your spam folder or contact us directly.
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
