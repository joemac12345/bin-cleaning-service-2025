/**
 * INLINE POSTCODE CHECKER - Single Line Compact Version
 * ===================================================
 * 
 * Ultra-compact postcode checker for tight spaces:
 * - Single horizontal line layout
 * - Minimal height footprint
 * - Perfect for hero sections or call-to-action blocks
 * - Responsive design that stacks on mobile
 */

'use client';

import { useState } from 'react';
import { MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { formatPostcode } from '@/components/postcode-manager/services/postcodeService';

// Simple UK postcode validation
const isValidUKPostcodeFormat = (postcode: string): boolean => {
  const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/;
  return ukPostcodeRegex.test(postcode.replace(/\s+/g, ' ').toUpperCase());
};

interface InlinePostcodeCheckerProps {
  onServiceAvailable: (postcode: string) => void;
  onWaitlist: (postcode: string) => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
}

export default function InlinePostcodeChecker({ 
  onServiceAvailable, 
  onWaitlist,
  size = 'md',
  theme = 'light'
}: InlinePostcodeCheckerProps) {
  const [postcode, setPostcode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'text-sm py-2 px-3',
    md: 'text-base py-3 px-4',
    lg: 'text-lg py-4 px-5'
  };

  const themeClasses = {
    light: {
      input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
      button: 'bg-[#3B4044] hover:bg-[#2a2d30] text-white',
      error: 'bg-red-50 border-red-200 text-red-700'
    },
    dark: {
      input: 'bg-gray-800 border-gray-600 text-white placeholder-gray-400',
      button: 'bg-white hover:bg-gray-100 text-gray-900',
      error: 'bg-red-900/20 border-red-800 text-red-400'
    }
  };

  const checkPostcode = async () => {
    if (!postcode.trim()) {
      setError('Enter postcode');
      return;
    }

    const formattedPostcode = formatPostcode(postcode.trim());
    
    if (!isValidUKPostcodeFormat(formattedPostcode)) {
      setError('Invalid UK postcode');
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch('/api/postcodes/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode: formattedPostcode }),
      });

      const data = await response.json();

      if (data.available) {
        onServiceAvailable(formattedPostcode);
      } else {
        onWaitlist(formattedPostcode);
      }
    } catch (error) {
      console.error('Postcode check error:', error);
      setError('Check failed');
    } finally {
      setIsChecking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkPostcode();
    }
  };

  return (
    <div className="w-full">
      {/* Single Line Input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            theme === 'light' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            value={postcode}
            onChange={(e) => {
              setPostcode(e.target.value.toUpperCase());
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Your postcode..."
            className={`
              w-full pl-9 pr-3 border rounded-lg focus:ring-2 focus:ring-[#3B4044] focus:border-[#3B4044] transition-colors
              ${sizeClasses[size]}
              ${themeClasses[theme].input}
            `}
            disabled={isChecking}
          />
        </div>
        
        <button
          onClick={checkPostcode}
          disabled={isChecking || !postcode.trim()}
          className={`
            disabled:opacity-50 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium whitespace-nowrap
            ${sizeClasses[size]}
            ${themeClasses[theme].button}
          `}
        >
          {isChecking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Check
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Error Message (Compact) */}
      {error && (
        <div className={`
          mt-2 px-3 py-1 rounded text-sm border
          ${themeClasses[theme].error}
        `}>
          {error}
        </div>
      )}
    </div>
  );
}
