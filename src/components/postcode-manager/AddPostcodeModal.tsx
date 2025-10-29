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
    try {
      const position = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => reject(err)
        );
      });

      const response = await fetch(`/api/postcode?lat=${position.latitude}&lon=${position.longitude}`);
      if (!response.ok) throw new Error('Failed to detect postcode');

      const data = await response.json();
      if (data.postcode) {
        setPostcode(data.postcode);
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      alert('Unable to detect location. Please enable location services and try again.');
    } finally {
      setIsDetectingLocation(false);
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
