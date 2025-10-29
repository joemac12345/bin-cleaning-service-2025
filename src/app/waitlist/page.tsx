'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Clock, Mail } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleBack = () => {
    router.push('/postcode');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Here you would typically send the data to your backend
    console.log('Waitlist submission:', { postcode, email });
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  // If no postcode is provided, redirect to postcode checker
  if (!postcode) {
    router.push('/postcode');
    return null;
  }

  return (
    <>
      <TopNavigation />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center px-2 sm:px-4 py-4 sm:py-8">
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        {!isSubmitted ? (
          <FormContainer maxWidth="md">
            
            <FormHeader 
              title="Join Waitlist" 
              onBack={handleBack}
            />

            <FormContent>
              {/* Icon and main content */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Not yet available</h2>
                <p className="text-gray-600 mb-3 leading-relaxed">
                  We don&apos;t serve <strong className="text-gray-900">{postcode}</strong> yet, but we&apos;re expanding!
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Join our waitlist and we&apos;ll notify you when we launch in your area.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="your.email@example.com"
                  required
                />

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  fullWidth
                  variant="blue"
                >
                  Join Waitlist
                </Button>
              </form>

              {/* Additional info */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  We typically expand to new areas within 2-4 weeks of receiving requests.
                </p>
                
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                  <a href="#" className="text-blue-600 hover:underline py-2 px-1">Facebook</a>
                  <a href="#" className="text-blue-600 hover:underline py-2 px-1">Twitter</a>
                  <a href="#" className="text-blue-600 hover:underline py-2 px-1">Instagram</a>
                </div>
              </div>
            </FormContent>
          </FormContainer>
        ) : (
          <FormContainer maxWidth="md">
            
            <FormContent className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                You&apos;re on the waitlist!
              </h2>
              
              <div className="space-y-3 text-gray-600 mb-6 leading-relaxed">
                <p>
                  We&apos;ve added <strong className="text-gray-900">{email}</strong> to our waitlist for <strong className="text-gray-900">{postcode}</strong>.
                </p>
                <p>
                  We&apos;ll notify you as soon as we start serving your area. 
                  This usually happens within 2-4 weeks of adding new locations.
                </p>
                <p className="text-sm">
                  In the meantime, follow us on social media for updates and tips!
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleBack}
                  variant="primary"
                  fullWidth
                >
                  Check Another Postcode
                </Button>
                
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                  <a href="#" className="text-blue-600 hover:underline py-2 px-1">Facebook</a>
                  <a href="#" className="text-blue-600 hover:underline py-2 px-1">Twitter</a>
                  <a href="#" className="text-blue-600 hover:underline py-2 px-1">Instagram</a>
                </div>
              </div>
            </FormContent>
          </FormContainer>
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
