/**
 * COMPACT POSTCODE CHECKER - Inline Landing Page Component
 * =======================================================
 * 
 * A smaller, streamlined version of the main postcode checker
 * designed to be embedded directly on landing pages.
 * 
 * Features:
 * - Compact single-line input design
 * - Quick validation and service area checking
 * - Minimal UI with clear call-to-action
 * - Mobile-optimized for all screen sizes
 * - Direct integration with existing postcode service
 * 
 * Perfect for:
 * - Hero sections
 * - Inline content blocks
 * - Quick service availability checks
 * - Lead capture forms
 */

'use client';

import { useState } from 'react';
import { MapPin, CheckCircle, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { formatPostcode } from '@/components/postcode-manager/services/postcodeService';

// Simple UK postcode validation
const isValidUKPostcodeFormat = (postcode: string): boolean => {
  const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/;
  return ukPostcodeRegex.test(postcode.replace(/\s+/g, ' ').toUpperCase());
};

interface CompactPostcodeCheckerProps {
  onServiceAvailable: (postcode: string) => void;
  onWaitlist: (postcode: string) => void;
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

export default function CompactPostcodeChecker({ 
  onServiceAvailable, 
  onWaitlist,
  placeholder = "Enter your postcode...",
  buttonText = "Check Service",
  className = ""
}: CompactPostcodeCheckerProps) {
  const [postcode, setPostcode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<'available' | 'waitlist' | null>(null);

  const checkPostcode = async () => {
    if (!postcode.trim()) {
      setError('Please enter a postcode');
      return;
    }

    const formattedPostcode = formatPostcode(postcode.trim());
    
    if (!isValidUKPostcodeFormat(formattedPostcode)) {
      setError('Please enter a valid UK postcode');
      return;
    }

    setIsChecking(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/postcodes/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode: formattedPostcode }),
      });

      const data = await response.json();

      if (data.available) {
        setResult('available');
        setTimeout(() => onServiceAvailable(formattedPostcode), 1500);
      } else {
        setResult('waitlist');
        setTimeout(() => onWaitlist(formattedPostcode), 1500);
      }
    } catch (error) {
      console.error('Postcode check error:', error);
      setError('Unable to check service area. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkPostcode();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkPostcode();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={postcode}
              onChange={(e) => {
                setPostcode(e.target.value.toUpperCase());
                setError(null);
                setResult(null);
              }}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B4044] focus:border-[#3B4044] text-lg placeholder-gray-500"
              disabled={isChecking}
            />
          </div>
          
          <button
            type="submit"
            disabled={isChecking || !postcode.trim()}
            className="bg-[#3B4044] hover:bg-[#2a2d30] disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-lg font-medium whitespace-nowrap"
          >
            {isChecking ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                {buttonText}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Success/Result Messages */}
        {result === 'available' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">✅ Great news! We service your area</p>
              <p className="text-green-700 text-sm">Redirecting you to our booking page...</p>
            </div>
          </div>
        )}

        {result === 'waitlist' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
            <Clock className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-amber-800 font-medium">📍 Not in your area yet</p>
              <p className="text-amber-700 text-sm">Join our waitlist and we'll notify you when we expand!</p>
            </div>
          </div>
        )}
      </form>

      {/* Quick Info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          🏠 Currently serving <span className="font-medium">25+ areas</span> across the UK
        </p>
      </div>
    </div>
  );
}
