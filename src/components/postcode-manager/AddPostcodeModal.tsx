'use client';

import { useState } from 'react';
import { X, Navigation, Plus, CheckCircle, XCircle } from 'lucide-react';

interface AddPostcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postcode: string, areaName: string) => Promise<void>;
  isLoading?: boolean;
}

export default function AddPostcodeModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AddPostcodeModalProps) {
  const [postcode, setPostcode] = useState('');
  const [areaName, setAreaName] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [validationResult, setValidationResult] = useState<{ postcode: string; isValid: boolean } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const detectLocationPostcode = async () => {
    setIsDetectingLocation(true);
    console.log('🎯 Starting location detection...');
    
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        const msg = '⚠️ Location services are not supported by your browser.\n\nPlease enter the postcode manually.';
        alert(msg);
        console.error('Geolocation not supported');
        return;
      }

      // Check if HTTPS (required for geolocation on most browsers)
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        const msg = '⚠️ Location detection requires a secure connection (HTTPS).\n\nPlease enter the postcode manually.';
        alert(msg);
        console.error('Not HTTPS - geolocation blocked');
        return;
      }

      console.log('📍 Requesting geolocation permission...');

      const position = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log('✅ Geolocation granted:', { 
              lat: pos.coords.latitude, 
              lon: pos.coords.longitude,
              accuracy: pos.coords.accuracy 
            });
            resolve(pos.coords);
          },
          (err) => {
            console.error('❌ Geolocation error:', { code: err.code, message: err.message });
            
            // Provide specific error messages
            let errorMessage = '⚠️ Unable to detect location.\n\n';
            switch(err.code) {
              case err.PERMISSION_DENIED:
                errorMessage += 'Location permission denied.\n\nTo enable:\n1. Click the 🔒 or ⓘ icon in your browser address bar\n2. Find Location/Site permissions\n3. Select "Allow" for location access\n4. Refresh the page and try again';
                break;
              case err.POSITION_UNAVAILABLE:
                errorMessage += 'Location information unavailable.\n\nPlease check:\n• Device location services are ON\n• You have internet connection\n• Try again in a few moments';
                break;
              case err.TIMEOUT:
                errorMessage += 'Location request timed out.\n\nPlease:\n• Check your internet connection\n• Try again\n• Or enter postcode manually';
                break;
              default:
                errorMessage += 'An unknown error occurred.\n\nPlease enter the postcode manually.';
            }
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true, // Use GPS for better accuracy
            timeout: 15000, // 15 second timeout
            maximumAge: 0 // Don't use cached position
          }
        );
      });

      console.log('🌍 Reverse geocoding coordinates...');
      const apiUrl = `/api/reverse-geocode?lat=${position.latitude}&lon=${position.longitude}`;
      console.log('API URL:', apiUrl);

      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to detect postcode from coordinates');
      }

      if (data.postcode) {
        setPostcode(data.postcode);
        
        // Auto-fill area name if available
        if (data.address?.city && !areaName) {
          setAreaName(data.address.city);
        }
        
        const successMsg = `✅ Location detected successfully!\n\nPostcode: ${data.postcode}${data.address?.city ? '\nArea: ' + data.address.city : ''}`;
        alert(successMsg);
        console.log('✅ Detection complete:', data.postcode);
      } else {
        throw new Error(data.message || 'No postcode found for your location');
      }
    } catch (error: any) {
      console.error('❌ Location detection failed:', error);
      alert(error.message || 'Unable to detect location. Please enter the postcode manually.');
    } finally {
      setIsDetectingLocation(false);
      console.log('🏁 Location detection finished');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim() || isSaving) return;

    setIsSaving(true);
    try {
      await onSubmit(postcode, areaName);
      setPostcode('');
      setAreaName('');
      setValidationResult(null);
      onClose();
    } catch (error) {
      console.error('Error adding postcode:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Service Area</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Postcode Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Postcode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              placeholder="e.g., SW1A 1AA"
              className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter a valid UK postcode</p>
          </div>

          {/* Area Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Area Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              placeholder="e.g., Central London, Westminster"
              className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Validation Result */}
          {validationResult && (
            <div
              className={`p-3 rounded-lg flex items-center space-x-2 ${
                validationResult.isValid
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              }`}
            >
              {validationResult.isValid ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm">
                {validationResult.isValid
                  ? `${validationResult.postcode} is valid`
                  : `${validationResult.postcode} is not valid`}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={detectLocationPostcode}
              disabled={isDetectingLocation || isSaving}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              {isDetectingLocation ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Detecting...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>Use Location</span>
                </>
              )}
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !postcode.trim()}
                className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add Area</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
