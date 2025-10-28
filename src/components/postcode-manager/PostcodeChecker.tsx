'use client';

import { useState, useEffect } from 'react';
import { MapPin, CheckCircle, Clock, ArrowRight, Navigation } from 'lucide-react';
import { formatPostcode, extractPostcodeArea } from '@/components/postcode-manager/services/postcodeService';

// Basic UK postcode validation for offline fallback
const isValidUKPostcodeFormat = (postcode: string): boolean => {
  const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/;
  return ukPostcodeRegex.test(postcode.replace(/\s+/g, ' ').toUpperCase());
};
import usePostcodeService from '@/components/postcode-manager/hooks/usePostcodeService';
import useInvalidPostcodeService from '@/components/postcode-manager/hooks/useInvalidPostcodeService';

interface PostcodeCheckerProps {
  onServiceAvailable: (postcode: string) => void;
  onWaitlist: (postcode: string) => void;
}

export default function PostcodeChecker({ onServiceAvailable, onWaitlist }: PostcodeCheckerProps) {
  const [postcode, setPostcode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<'available' | 'waitlist' | null>(null);
  const [error, setError] = useState('');
  const [typewriterText, setTypewriterText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  
  // Use the new hook for postcode service management
  const { activePostcodes } = usePostcodeService();
  const { trackInvalid } = useInvalidPostcodeService();

  useEffect(() => {
    const text = 'Enter your postcode';
    let index = 0;
    let isDeleting = false;
    
    const typeInterval = setInterval(() => {
      if (!isDeleting) {
        // Typing forward
        if (index <= text.length) {
          setTypewriterText(text.slice(0, index));
          index++;
        } else {
          // Wait a bit then start deleting
          setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      } else {
        // Deleting backwards
        if (index > 0) {
          index--;
          setTypewriterText(text.slice(0, index));
        } else {
          // Start typing again
          isDeleting = false;
        }
      }
    }, isDeleting ? 50 : 100);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  const checkPostcode = async () => {
    if (!postcode.trim()) {
      setError('Please enter a postcode');
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      console.log('🔍 Checking postcode:', postcode);
      
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      // Call the database API instead of using localStorage
      const response = await fetch(`/api/postcodes?postcode=${encodeURIComponent(postcode)}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Postcode API response:', data);
      
      const formattedPostcode = formatPostcode(postcode);

      if (data.isValid) {
        setResult('available');
        setTimeout(() => {
          onServiceAvailable(formattedPostcode);
        }, 2000);
      } else {
        // Track invalid postcode for demand analysis
        const area = extractPostcodeArea(formattedPostcode);
        trackInvalid(formattedPostcode, area);
        setResult('waitlist');
        setTimeout(() => {
          onWaitlist(formattedPostcode);
        }, 1500);
      }

    } catch (error: any) {
      console.error('❌ Postcode validation error:', error);
      console.log('🔄 Attempting offline fallback validation...');
      
      // Offline fallback: basic format validation
      const formattedPostcode = formatPostcode(postcode);
      
      if (!isValidUKPostcodeFormat(formattedPostcode)) {
        setError('Please enter a valid UK postcode format (e.g., M1 1AA, SW1A 1AA)');
      } else {
        // Valid format but can't verify service area - show as waitlist
        console.log('📝 Using offline fallback - valid format, adding to waitlist');
        
        const area = extractPostcodeArea(formattedPostcode);
        trackInvalid(formattedPostcode, area);
        
        setResult('waitlist');
        setTimeout(() => {
          onWaitlist(formattedPostcode);
        }, 1500);
      }
    }

    setIsChecking(false);
  };

  const autoDetectPostcode = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsDetecting(true);
    setError('');

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;

      // Use Nominatim (OpenStreetMap) reverse geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&countrycodes=gb&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'BinCleaningApp/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get location data');
      }

      const data = await response.json();
      
      // Extract postcode from the response
      const postcode = data.address?.postcode;
      
      if (postcode) {
        setPostcode(postcode.toUpperCase());
      } else {
        throw new Error('Postcode not found for this location');
      }

      setIsDetecting(false);
    } catch (error) {
      console.error('Location detection error:', error);
      setError('Unable to detect your postcode. Please enter it manually.');
      setIsDetecting(false);
    }
  };

  return (
    <div className="w-full md:max-w-2xl md:mx-auto p-4 md:p-8">
      {result === null && (
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Check Service Area</h2>
              <p className="text-gray-600">Enter your postcode to see if we serve your area</p>
            </div>
          </div>
        </div>
      )}

      {result === null && (
        <div className="space-y-6">
          <div>
            <div className="relative">
              <input
                id="postcode"
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                placeholder={`${typewriterText}${showCursor ? '|' : ''}`}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                onKeyPress={(e) => e.key === 'Enter' && checkPostcode()}
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 py-2 px-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={autoDetectPostcode}
              disabled={isDetecting || isChecking}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 border border-gray-300"
            >
              {isDetecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Detecting...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5" />
                  <span>Auto-detect</span>
                </>
              )}
            </button>
            
            <button
              onClick={checkPostcode}
              disabled={isChecking || !postcode.trim()}
              className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isChecking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <span>Check Postcode</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
          
          {/* Active Service Areas Display */}
          {activePostcodes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Service Areas:</h3>
              <div className="flex flex-wrap gap-2">
                {activePostcodes.map((postcode) => (
                  <span
                    key={postcode}
                    className="px-3 py-1 bg-black text-white text-sm rounded-full font-medium"
                  >
                    {postcode}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {result === 'available' && (
        <div className="space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Great news!</h3>
            <p className="text-gray-600 mb-4">
              We serve <strong>{formatPostcode(postcode)}</strong>
            </p>
            <p className="text-sm text-gray-500">
              You&apos;ll be redirected to our booking form shortly...
            </p>
          </div>
          <div className="flex">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}

      {result === 'waitlist' && (
        <div className="space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Not yet available</h3>
            <p className="text-gray-600 mb-4">
              We don&apos;t serve <strong>{formatPostcode(postcode)}</strong> yet, but we&apos;re expanding!
            </p>
            <p className="text-sm text-gray-500">
              You&apos;ll be redirected to join our waitlist...
            </p>
          </div>
          <div className="flex">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
