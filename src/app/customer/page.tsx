'use client';

import Link from 'next/link';
import { CheckCircle, Mail, Calendar, CreditCard, Home } from 'lucide-react';
import { 
  FormContainer, 
  FormHeader, 
  FormContent, 
  FormSection,
  Button,
  ButtonGroup
} from '@/components/ui/Form';

export default function ThankYouPage() {

  return (
    <div className="min-h-screen bg-white py-4 px-4 pb-20">
      <div className="w-full max-w-4xl mx-auto">
        <FormContainer maxWidth="lg" fullWidthOnMobile={false}>
          <FormContent>
            {/* Success Message */}
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-20 h-20 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
              <h2 className="text-xl text-gray-600 mb-6">Your bin cleaning booking has been received</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                We've successfully received your booking request and will begin processing it immediately.
              </p>
            </div>

            {/* What Happens Next */}
            <FormSection>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">What happens next?</h3>
              
              <div className="space-y-6">
                {/* Step 1: Email Confirmation */}
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Mail className="w-8 h-8 text-blue-600 mt-1" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">1. Email Confirmation</h4>
                    <p className="text-gray-700 text-sm">
                      You'll receive an email confirmation with your booking details shortly. Please keep this for your records.
                    </p>
                  </div>
                </div>

                {/* Step 2: Processing & Scheduling */}
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Calendar className="w-8 h-8 text-green-600 mt-1" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">2. Processing & Scheduling</h4>
                    <p className="text-gray-700 text-sm">
                      Our team will process your booking and schedule your bin cleaning service based on your preferred collection day.
                    </p>
                  </div>
                </div>

                {/* Step 3: Service Notification */}
                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <CreditCard className="w-8 h-8 text-purple-600 mt-1" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">3. Service Notification</h4>
                    <p className="text-gray-700 text-sm">
                      You'll be notified when your service is scheduled and will receive payment instructions before the service takes place.
                    </p>
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Need Help Section */}
            <FormSection>
              <div className="bg-gray-50 p-6 rounded-lg text-center mb-8">
                <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                <p className="text-gray-600 text-sm mb-4">
                  If you have any questions about your booking or need to make changes, please don't hesitate to contact us.
                </p>
                <div className="text-sm text-gray-500">
                  <p>Email: support@bincleaningservice.com</p>
                  <p>Phone: 01234 567 890</p>
                </div>
              </div>
            </FormSection>
          </FormContent>

          {/* Bottom Actions */}
          <div className="mt-8 mb-8 text-center">
            <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
