/**
 * POSTCODE CHECKER COMPONENT - Service Area Validation & Lead Capture
 * ==================================================================
 * 
 * REDESIGNED VERSION: Fun, Friendly, Branded UX
 * 
 * This is the CORE BUSINESS LOGIC component for your bin cleaning service.
 * It determines whether you can serve a customer and routes them accordingly.
 * 
 * NOW WITH:
 * - 🎨 Warm brand colors (orange, amber, emerald gradients)
 * - 🎉 Engaging emoji usage throughout
 * - 💬 Friendly, conversational copy
 * - ✨ Smooth animations and transitions
 * - 📱 Mobile-first responsive design
 * - 🎯 Clear visual hierarchy
 * 
 * Primary Functions:
 * - Validates customer postcodes against your service areas database
 * - Routes qualified customers to booking form (revenue generation)
 * - Captures leads from unserviced areas via waitlist (expansion planning)
 * - Provides auto-location detection for better user experience
 * - Displays current service areas to set customer expectations
 * 
 * Business Impact:
 * - REVENUE: Converts qualified leads to bookings
 * - EXPANSION: Tracks demand in new areas for business growth
 * - UX: Prevents frustrated customers from areas you don't serve yet
 * - EFFICIENCY: Pre-qualifies customers before they reach booking form
 */

'use client';

import { useState, useEffect } from 'react';
import { MapPin, CheckCircle, Clock, ArrowRight, Navigation, Zap } from 'lucide-react';
import { formatPostcode, extractPostcodeArea } from '@/components/postcode-manager/services/postcodeService';
import usePostcodeService from '@/components/postcode-manager/hooks/usePostcodeService';
import useInvalidPostcodeService from '@/components/postcode-manager/hooks/useInvalidPostcodeService';

// OFFLINE VALIDATION UTILITY
const isValidUKPostcodeFormat = (postcode: string): boolean => {
  const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/;
  return ukPostcodeRegex.test(postcode.replace(/\s+/g, ' ').toUpperCase());
};

interface PostcodeCheckerProps {
  onServiceAvailable: (postcode: string) => void;
  onWaitlist: (postcode: string) => void;
}

export default function PostcodeChecker({ onServiceAvailable, onWaitlist }: PostcodeCheckerProps) {
  
  // STATE MANAGEMENT
  const [postcode, setPostcode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<'available' | 'waitlist' | null>(null);
  const [error, setError] = useState('');
  const [typewriterText, setTypewriterText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  
  const { activePostcodes } = usePostcodeService();
  const { trackInvalid } = useInvalidPostcodeService();

  // TYPEWRITER ANIMATION EFFECT
  useEffect(() => {
    const text = 'Enter your postcode';
    let index = 0;
    let isDeleting = false;
    
    const typeInterval = setInterval(() => {
      if (!isDeleting) {
        if (index <= text.length) {
          setTypewriterText(text.slice(0, index));
          index++;
        } else {
          setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      } else {
        if (index > 0) {
          index--;
          setTypewriterText(text.slice(0, index));
        } else {
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

  // CORE BUSINESS LOGIC
  const checkPostcode = async () => {
    if (!postcode.trim()) {
      setError('Please enter a postcode');
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      console.log('🔍 Checking postcode:', postcode);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
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
      
      const formattedPostcode = formatPostcode(postcode);
      
      if (!isValidUKPostcodeFormat(formattedPostcode)) {
        setError('Please enter a valid UK postcode (e.g., M1 1AA, SW1A 1AA)');
      } else {
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

  // AUTO-DETECTION FEATURE
  const autoDetectPostcode = async () => {
    if (!navigator.geolocation) {
      setError('Location services not available. Please type your postcode above.');
      return;
    }

    setIsDetecting(true);
    setError('');

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve, 
          (error) => {
            switch(error.code) {
              case error.PERMISSION_DENIED:
                reject(new Error('Location access denied. Please type your postcode above.'));
                break;
              case error.POSITION_UNAVAILABLE:
                reject(new Error('Location unavailable. Please type your postcode above.'));
                break;
              case error.TIMEOUT:
                reject(new Error('Location timeout. Please type your postcode above.'));
                break;
              default:
                reject(new Error('Location error. Please type your postcode above.'));
                break;
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 60000
          }
        );
      });

      const { latitude, longitude } = position.coords;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&countrycodes=gb&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'BinCleaningApp/1.0'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Location service unavailable. Please type your postcode above.');
      }

      const data = await response.json();
      const detectedPostcode = data.address?.postcode;
      
      if (detectedPostcode) {
        setPostcode(detectedPostcode.toUpperCase());
        setError('');
      } else {
        throw new Error('No postcode found for your location. Please type your postcode above.');
      }

    } catch (error: any) {
      console.error('Location detection error:', error);
      
      if (error.name === 'AbortError') {
        setError('Location detection timed out. Please type your postcode above.');
      } else {
        setError(error.message || 'Auto-detection failed. Please type your postcode above.');
      }
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="w-full md:max-w-xl md:mx-auto px-6 py-8 md:p-8">
      {result === null && (
        <div className="space-y-8">
          {/* Input Section */}
          <div className="space-y-5">
            {/* Main Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <span className="text-xl">📮</span>
                <span>Your postcode</span>
              </label>
              <div className="relative group">
                <input
                  id="postcode"
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  placeholder={error ? 'Type your postcode (e.g. M1 1AA)' : `${typewriterText}${showCursor ? '|' : ''}`}
                  className={`w-full px-5 py-4 bg-white border-2 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all text-base font-medium placeholder:text-slate-400 ${
                    error 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-slate-200 group-hover:border-blue-300'
                  }`}
                  onKeyPress={(e) => e.key === 'Enter' && checkPostcode()}
                />
                <MapPin className={`absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                  error ? 'text-red-400' : 'text-slate-400'
                }`} />
              </div>
            </div>

            {/* Error Message - Improved */}
            {error && (
              <div className="text-red-700 text-sm bg-red-50 py-3 px-4 rounded-lg leading-relaxed border-l-4 border-red-400 animate-pulse">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="text-lg">⚠️</span>
                  </div>
                  <div>
                    <p className="font-semibold">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Buttons - Improved Design */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={autoDetectPostcode}
              disabled={isDetecting || isChecking}
              className="flex-1 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 py-4 px-6 rounded-xl font-semibold hover:from-slate-200 hover:to-slate-100 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed transition-all border-2 border-slate-200 hover:border-slate-300 flex items-center justify-center space-x-2 text-base"
            >
              {isDetecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
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
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-2 text-base"
            >
              {isChecking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Check Area</span>
                </>
              )}
            </button>
          </div>

          {/* Current Service Areas - Enhanced */}
          {activePostcodes.length > 0 && (
            <div className="mt-8 pt-8 border-t-2 border-slate-200">
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center space-x-2 uppercase tracking-wide">
                <span className="text-lg">✓</span>
                <span>We currently serve</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {activePostcodes.map((postcode) => (
                  <span
                    key={postcode}
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-900 text-sm font-semibold rounded-full border-2 border-blue-200"
                  >
                    ✓ {postcode}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-4">
                💡 Tip: Enter your postcode to check if it's in our service area or to join our waitlist if we're not there yet!
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUCCESS STATE - Service Available */}
      {result === 'available' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-5xl">🎉</span>
            </div>
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Great news! 🚀
            </h3>
            <p className="text-slate-700 text-lg font-semibold">
              We serve <span className="text-blue-600">{formatPostcode(postcode)}</span>
            </p>
            <p className="text-slate-600 text-base">
              Let's get your bins cleaned! 🧹
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Redirecting you to book now...
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* WAITLIST STATE - Not Yet Available */}
      {result === 'waitlist' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-5xl">📍</span>
            </div>
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-slate-900">
              Coming soon! 🌍
            </h3>
            <p className="text-slate-700 text-lg font-semibold">
              We're not in <span className="text-orange-600">{formatPostcode(postcode)}</span> yet
            </p>
            <p className="text-slate-600 text-base">
              But we're expanding! Join our waitlist to be first to know when we arrive 💌
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Redirecting to waitlist...
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

