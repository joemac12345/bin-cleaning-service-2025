/**
 * POSTCODE CHECKER COMPONENT - Service Area Validation & Lead Capture
 * ==================================================================
 * 
 * This is the CORE BUSINESS LOGIC component for your bin cleaning service.
 * It determines whether you can serve a customer and routes them accordingly.
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
 * 
 * User Journey Flow:
 * 1. User lands on home page
 * 2. Enters postcode (manual or auto-detect)
 * 3a. SERVICE AVAILABLE → "Great news!" → Redirect to /booking
 * 3b. NOT AVAILABLE YET → "Not yet available" → Redirect to /waitlist
 * 
 * Technical Architecture:
 * - Client-side validation with server-side database lookup
 * - Fallback mechanisms for offline/API failures
 * - Geolocation integration with OpenStreetMap reverse geocoding
 * - Real-time typewriter animation for engaging UX
 * - Mobile-first responsive design following TikTok principles
 * 
 * Database Integration:
 * - Connects to Supabase service areas table
 * - Tracks invalid postcodes for demand analysis
 * - Displays active service areas from database
 * 
 * Error Handling:
 * - Graceful API failure fallbacks
 * - User-friendly geolocation error messages
 * - Offline postcode format validation
 * - Clear guidance for manual entry when auto-detect fails
 */

'use client';

import { useState, useEffect } from 'react';
import { MapPin, CheckCircle, Clock, ArrowRight, Navigation } from 'lucide-react';
import { formatPostcode, extractPostcodeArea } from '@/components/postcode-manager/services/postcodeService';
import usePostcodeService from '@/components/postcode-manager/hooks/usePostcodeService';
import useInvalidPostcodeService from '@/components/postcode-manager/hooks/useInvalidPostcodeService';

// OFFLINE VALIDATION UTILITY
// ===========================
// Provides basic UK postcode format validation when API is unavailable
// Regex pattern matches standard UK postcode formats (e.g., M1 1AA, SW1A 1AA)
const isValidUKPostcodeFormat = (postcode: string): boolean => {
  const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/;
  return ukPostcodeRegex.test(postcode.replace(/\s+/g, ' ').toUpperCase());
};

// COMPONENT INTERFACE
// ===================
// Props passed from parent components (usually home page)
interface PostcodeCheckerProps {
  onServiceAvailable: (postcode: string) => void; // Callback when customer is in service area
  onWaitlist: (postcode: string) => void;         // Callback when customer needs to join waitlist
}

// MAIN COMPONENT FUNCTION
// =======================
// Core postcode validation and routing logic
export default function PostcodeChecker({ onServiceAvailable, onWaitlist }: PostcodeCheckerProps) {
  
  // STATE MANAGEMENT
  // ================
  // Component state for user interaction and API responses
  const [postcode, setPostcode] = useState('');                              // User input postcode
  const [isChecking, setIsChecking] = useState(false);                      // Loading state for API calls
  const [result, setResult] = useState<'available' | 'waitlist' | null>(null); // Validation result
  const [error, setError] = useState('');                                    // Error messages for user
  const [typewriterText, setTypewriterText] = useState('');                 // Animated placeholder text
  const [showCursor, setShowCursor] = useState(true);                       // Cursor blinking animation
  const [isDetecting, setIsDetecting] = useState(false);                    // Geolocation loading state
  
  // CUSTOM HOOKS INTEGRATION
  // ========================
  // Connect to database services and business logic
  const { activePostcodes } = usePostcodeService();           // Fetch current service areas from database
  const { trackInvalid } = useInvalidPostcodeService();       // Track postcodes for expansion planning

  // TYPEWRITER ANIMATION EFFECT
  // ===========================
  // Creates engaging placeholder text that types and deletes continuously
  // Improves user engagement and draws attention to the input field
  useEffect(() => {
    const text = 'Enter your postcode';
    let index = 0;
    let isDeleting = false;
    
    const typeInterval = setInterval(() => {
      if (!isDeleting) {
        // TYPING FORWARD: Add one character at a time
        if (index <= text.length) {
          setTypewriterText(text.slice(0, index));
          index++;
        } else {
          // PAUSE: Wait before starting to delete
          setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      } else {
        // DELETING BACKWARD: Remove one character at a time
        if (index > 0) {
          index--;
          setTypewriterText(text.slice(0, index));
        } else {
          // RESTART: Begin typing cycle again
          isDeleting = false;
        }
      }
    }, isDeleting ? 50 : 100); // Faster deletion than typing for natural feel

    // CURSOR BLINKING: Independent cursor animation
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    // CLEANUP: Clear intervals when component unmounts
    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  // CORE BUSINESS LOGIC: Postcode Validation & Customer Routing
  // ===========================================================
  // This function determines if you can serve a customer and routes them accordingly
  // CRITICAL BUSINESS FUNCTION: Directly impacts revenue and customer acquisition
  const checkPostcode = async () => {
    // INPUT VALIDATION: Ensure user has entered something
    if (!postcode.trim()) {
      setError('Please enter a postcode');
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      console.log('🔍 Checking postcode:', postcode);
      
      // API TIMEOUT PROTECTION: Prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      // DATABASE LOOKUP: Check if postcode is in your service areas
      // This API call connects to your Supabase service areas table
      const response = await fetch(`/api/postcodes?postcode=${encodeURIComponent(postcode)}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',    // Prevent stale cache data
          'Pragma': 'no-cache'           // Ensure fresh database lookup
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // ERROR HANDLING: Check API response status
      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Postcode API response:', data);
      
      const formattedPostcode = formatPostcode(postcode);

      // BUSINESS LOGIC BRANCHING
      // ========================
      if (data.isValid) {
        // SERVICE AVAILABLE: Customer is in your service area
        // REVENUE OPPORTUNITY: Route to booking form for conversion
        setResult('available');
        setTimeout(() => {
          onServiceAvailable(formattedPostcode); // → /booking?postcode=XX
        }, 2000);
      } else {
        // SERVICE NOT AVAILABLE: Customer outside current service area
        // EXPANSION OPPORTUNITY: Capture lead for future expansion
        const area = extractPostcodeArea(formattedPostcode);
        trackInvalid(formattedPostcode, area); // Store for demand analysis
        setResult('waitlist');
        setTimeout(() => {
          onWaitlist(formattedPostcode); // → /waitlist?postcode=XX
        }, 1500);
      }

    } catch (error: any) {
      console.error('❌ Postcode validation error:', error);
      console.log('🔄 Attempting offline fallback validation...');
      
      // OFFLINE FALLBACK STRATEGY
      // =========================
      // When API fails, still provide basic validation and capture leads
      const formattedPostcode = formatPostcode(postcode);
      
      if (!isValidUKPostcodeFormat(formattedPostcode)) {
        // INVALID FORMAT: Show format error to user
        setError('Please enter a valid UK postcode format (e.g., M1 1AA, SW1A 1AA)');
      } else {
        // VALID FORMAT BUT UNKNOWN SERVICE AREA: Conservative approach
        // Route to waitlist to avoid promising service we might not provide
        console.log('📝 Using offline fallback - valid format, adding to waitlist');
        
        const area = extractPostcodeArea(formattedPostcode);
        trackInvalid(formattedPostcode, area); // Still track for expansion planning
        
        setResult('waitlist');
        setTimeout(() => {
          onWaitlist(formattedPostcode); // → /waitlist?postcode=XX
        }, 1500);
      }
    }

    setIsChecking(false);
  };

  // AUTO-DETECTION FEATURE: GPS-Based Postcode Discovery
  // ====================================================
  // Improves user experience by automatically detecting customer location
  // Reduces friction in the conversion funnel
  const autoDetectPostcode = async () => {
    // BROWSER SUPPORT CHECK: Ensure geolocation is available
    if (!navigator.geolocation) {
      setError('Location services not available. Please type your postcode above.');
      return;
    }

    setIsDetecting(true);
    setError('');

    try {
      // STEP 1: GET GPS COORDINATES
      // ===========================
      // Request user's current location with permission handling
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve, 
          (error) => {
            // SPECIFIC ERROR HANDLING: Provide clear user guidance
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
            enableHighAccuracy: true,    // Use GPS instead of network location
            timeout: 8000,              // Fail fast to avoid user frustration
            maximumAge: 60000           // Cache location for 1 minute
          }
        );
      });

      const { latitude, longitude } = position.coords;

      // STEP 2: REVERSE GEOCODING
      // =========================
      // Convert GPS coordinates to UK postcode using OpenStreetMap
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&countrycodes=gb&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'BinCleaningApp/1.0'  // Required by Nominatim API
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      // API RESPONSE VALIDATION
      if (!response.ok) {
        throw new Error('Location service unavailable. Please type your postcode above.');
      }

      const data = await response.json();
      
      // STEP 3: EXTRACT POSTCODE
      // ========================
      // Parse postcode from geocoding response
      const detectedPostcode = data.address?.postcode;
      
      if (detectedPostcode) {
        // SUCCESS: Auto-fill input field with detected postcode
        setPostcode(detectedPostcode.toUpperCase());
        setError(''); // Clear any previous errors on success
      } else {
        throw new Error('No postcode found for your location. Please type your postcode above.');
      }

    } catch (error: any) {
      console.error('Location detection error:', error);
      
      // USER-FRIENDLY ERROR MESSAGES
      // =============================
      // Convert technical errors into actionable guidance
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
    <div className="w-full md:max-w-2xl md:mx-auto px-6 py-8 md:p-8">
      {result === null && (
        <div className="mb-10 md:mb-8">
          <div className="flex items-center space-x-4 sm:space-x-6 mb-6 md:mb-4">
            <div className="w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0">
              {/* 
                CUSTOM IMAGE SETUP
                ==================
                Circular image with border and shadow styling
                
                RECOMMENDED IMAGE SPECS:
                - Size: 128x128px (minimum) to 256x256px (optimal)
                - Format: PNG (transparent background) or JPG (solid background)
                - Quality: High resolution for crisp display on all devices
                
                IMAGE PLACEMENT:
                1. Add your image to the /public folder in your project root
                2. Update src="/your-image.jpg" to src="/your-actual-filename.png"
                3. Update alt text to describe your image
                
                EXAMPLES:
                - Company logo: src="/logo.png" alt="Company Logo"
                - Bin cleaning icon: src="/bin-icon.png" alt="Bin Cleaning Service"
                - Location marker: src="/location.png" alt="Service Location"
                
                The image will automatically:
                - Scale responsively (64px mobile, 72px desktop)  
                - Maintain aspect ratio with object-cover
                - Display as circular with border and shadow
              */}
              <img 
                src="/bin123.png"           // ← CHANGE THIS: Replace with your image filename
                alt="Service Area Check"         // ← CHANGE THIS: Describe your image  
                className="w-full h-full object-cover rounded-full border-2 border-gray-300 shadow-lg"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">Check Service Area</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Enter your postcode to see if we serve your area</p>
            </div>
          </div>
        </div>
      )}

      {result === null && (
        <div className="space-y-8 md:space-y-6">
          <div>
            <div className="relative">
              <input
                id="postcode"
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                placeholder={error ? 'Type your postcode (e.g. M1 1AA)' : `${typewriterText}${showCursor ? '|' : ''}`}
                className={`w-full px-4 py-4 sm:py-3 bg-white border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-base sm:text-sm ${
                  error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                onKeyPress={(e) => e.key === 'Enter' && checkPostcode()}
              />
              <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 py-3 px-4 rounded-lg leading-relaxed border-l-4 border-red-400">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Auto-detection failed</p>
                  <p className="mt-1">{error}</p>
                  <p className="mt-2 text-xs text-gray-600">Try typing your postcode in the box above (e.g., M1 1AA, SW1A 1AA)</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
            <button
              onClick={autoDetectPostcode}
              disabled={isDetecting || isChecking}
              className="flex-1 bg-gray-100 text-gray-700 py-4 sm:py-3 px-6 rounded-lg font-medium hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 border border-gray-300 text-base sm:text-sm"
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
              className="flex-1 bg-black text-white py-4 sm:py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-base sm:text-sm"
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
            <div className="mt-8 sm:mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 sm:mb-3">Current Service Areas:</h3>
              <div className="flex flex-wrap gap-3 sm:gap-2">
                {activePostcodes.map((postcode) => (
                  <span
                    key={postcode}
                    className="px-4 py-2 sm:px-3 sm:py-1 bg-black text-white text-sm rounded-full font-medium"
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
