'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CheckCircle, Mail, Calendar, Phone, Home, ArrowLeft } from 'lucide-react';

// Component that uses searchParams - must be wrapped in Suspense
function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    // Get booking reference safely on client side only
    const ref = searchParams.get('ref') || 'BIN-' + Date.now().toString().slice(-6);
    setBookingRef(ref);
  }, [searchParams]);

  useEffect(() => {
    // Smooth entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleBackToHome = () => {
    router.push('/');
  };

  const nextSteps = [
    {
      icon: Mail,
      title: "Email Confirmation",
      description: "You'll receive an email confirmation with your booking details shortly. Please keep this for your records.",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-l-blue-400"
    },
    {
      icon: Phone,
      title: "Contact Within 24 Hours",
      description: "Our team will contact you within 24 hours to confirm your service and arrange a convenient time.",
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-l-green-400"
    },
    {
      icon: Calendar,
      title: "Service Scheduled",
      description: "We'll schedule your bin cleaning service and notify you before we arrive to clean your bins.",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-l-purple-400"
    }
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8">
      {/* Background Image */}
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
      <div className="relative z-10 w-full max-w-2xl">
        <div 
          className={`transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-pulse">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Thank You! 🧽
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-4">
              Your bin cleaning booking has been received
            </p>
            
            {/* Booking Reference */}
            {bookingRef && (
              <div className="inline-block bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-6">
                <p className="text-sm font-medium text-green-700">
                  Booking Reference: <span className="font-bold">{bookingRef}</span>
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="text-center mb-10">
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              We've successfully received your booking request and will begin processing it immediately. 
              Your bins will be sparkling clean soon! ✨
            </p>
          </div>

          {/* What happens next section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
              What happens next?
            </h2>
            
            <div className="space-y-6">
              {nextSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={index}
                    className={`transition-all duration-700 ease-out transform ${
                      isVisible 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 translate-x-8'
                    }`}
                    style={{ transitionDelay: `${300 + index * 200}ms` }}
                  >
                    <div className={`${step.bgColor} rounded-2xl p-6 border-l-4 ${step.borderColor} shadow-sm hover:shadow-md transition-shadow duration-300`}>
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 p-2 rounded-full ${step.bgColor.replace('50', '100')}`}>
                          <Icon className={`w-6 h-6 ${step.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                  Important Information
                </h4>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  Please ensure your bins are accessible on the scheduled service day. 
                  We'll send you a reminder 24 hours before your service.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBackToHome}
              className="flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            
            <button
              onClick={() => router.push('/booking')}
              className="flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Book Another Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function ThankYouLoading() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-repeat"
        style={{
          backgroundImage: "url('/Backround grey.png')",
          backgroundSize: "300px 300px",
        }}
      />
      
      {/* Wallpaper Opacity Overlay */}
      <div className="absolute inset-0 bg-white/60" />
      
      {/* Loading Content */}
      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-pulse">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Loading... 🧽
        </h1>
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
