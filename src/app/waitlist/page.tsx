'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Clock, Mail, MapPin, Bell, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import TopNavigation from '@/components/TopNavigation';
import { 
  FormContainer, 
  FormHeader, 
  FormContent,
  FormSection,
  InputField,
  Button
} from '@/components/ui/Form';

function WaitlistContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postcode = searchParams.get('postcode') || '';
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleBack = () => {
    router.push('/postcode');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      // Send to API
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          postcode: postcode
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      console.log('Waitlist submission successful:', data);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Waitlist submission error:', err);
      setError(err.message || 'Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no postcode is provided, redirect to postcode checker
  if (!postcode) {
    router.push('/postcode');
    return null;
  }

  return (
    <>
      <TopNavigation />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
          {!isSubmitted ? (
            <div className="flex-1 flex flex-col">
              {/* Header - Fixed Height */}
              <div className="bg-blue-600 px-6 py-8">
                <div className="w-16 h-16 bg-white mb-4 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-semibold text-white mb-2">
                  Service Area Expansion
                </h1>
                <p className="text-blue-100 text-sm">
                  Join the waitlist for <span className="font-medium text-white">{postcode}</span>
                </p>
              </div>

              {/* Content - Scrollable if needed */}
              <div className="flex-1 px-6 py-6 overflow-y-auto">
                {/* Info Box */}
                <div className="bg-gray-50 border border-gray-200 px-4 py-4 mb-6">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    This postcode is not currently serviced. Register your interest to be notified when we expand to your area.
                  </p>
                </div>

                {/* Benefits - Compact List */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Priority Notification</h3>
                      <p className="text-xs text-gray-600 mt-0.5">First to know when we launch</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Launch Discount</h3>
                      <p className="text-xs text-gray-600 mt-0.5">Exclusive early adopter pricing</p>
                    </div>
                  </div>
                </div>

                {/* Email Form - Compact */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Smith"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none text-base"
                    />
                    
                    {error && (
                      <div className="mt-2 text-red-600 text-sm bg-red-50 border border-red-200 py-2 px-3">
                        {error}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3.5 px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Processing...
                      </span>
                    ) : (
                      'Join Waitlist'
                    )}
                  </button>
                </form>

                {/* Footer Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Typical expansion timeline: 2-4 weeks
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Success Header */}
              <div className="bg-blue-600 px-6 py-8">
                <div className="w-16 h-16 bg-white mb-4 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-semibold text-white mb-2">
                  Registration Complete
                </h1>
                <p className="text-blue-100 text-sm">
                  You're on the waitlist
                </p>
              </div>

              {/* Success Content */}
              <div className="flex-1 px-6 py-6 overflow-y-auto">
                {/* Confirmation Details */}
                <div className="bg-gray-50 border border-gray-200 px-4 py-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Confirmed</p>
                        <p className="text-xs text-gray-600 mt-0.5 break-all">{email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 pt-3 border-t border-gray-200">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Service Area</p>
                        <p className="text-xs text-gray-600 mt-0.5">{postcode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="mb-6">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">What Happens Next</h2>
                  <div className="space-y-3">
                    <div className="flex gap-3 text-sm text-gray-700">
                      <span className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-medium text-xs">1</span>
                      <p>We'll assess service demand in your area</p>
                    </div>
                    <div className="flex gap-3 text-sm text-gray-700">
                      <span className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-medium text-xs">2</span>
                      <p>You'll receive email notification when we launch</p>
                    </div>
                    <div className="flex gap-3 text-sm text-gray-700">
                      <span className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-medium text-xs">3</span>
                      <p>Access exclusive launch pricing</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleBack}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3.5 px-6 transition-colors"
                >
                  Check Another Postcode
                </button>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Estimated timeline: 2-4 weeks
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function WaitlistPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-2 sm:px-4">
        <div className="text-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-xs sm:text-sm">Loading...</p>
        </div>
      </div>
    }>
      <WaitlistContent />
    </Suspense>
  );
}
