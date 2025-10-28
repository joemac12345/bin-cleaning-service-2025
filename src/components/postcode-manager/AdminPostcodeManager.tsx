'use client';

import { useState } from 'react';
import { Plus, Trash2, MapPin, Save, Search, CheckCircle, XCircle, Navigation } from 'lucide-react';
import { 
  addServiceArea as addServiceAreaToService, 
  updateServiceAreaStatus, 
  removeServiceArea as removeServiceAreaFromService,
  validatePostcode,
  formatPostcode,
  extractPostcodeArea
} from '@/components/postcode-manager/services/postcodeService';
import usePostcodeService from '@/components/postcode-manager/hooks/usePostcodeService';

interface AdminPostcodeManagerProps {
  onPostcodeAdded?: () => void;
}

export default function AdminPostcodeManager({ onPostcodeAdded }: AdminPostcodeManagerProps) {
  const [newPostcode, setNewPostcode] = useState('');
  const [newAreaName, setNewAreaName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [validationResult, setValidationResult] = useState<{postcode: string, isValid: boolean} | null>(null);

  // Use the new hook for postcode service management
  const { serviceAreas, refresh: refreshServiceData } = usePostcodeService();

  const validatePostcodeLocal = async (postcode: string) => {
    const formattedPostcode = formatPostcode(postcode);
    
    try {
      const isValid = await validatePostcode(postcode);
      
      setValidationResult({
        postcode: formattedPostcode,
        isValid
      });
      
      return isValid;
    } catch {
      setValidationResult({
        postcode: formattedPostcode,
        isValid: false
      });
      return false;
    }
  };

  const detectLocationPostcode = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    setIsDetectingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;

      // Use Nominatim (OpenStreetMap) reverse geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&countrycodes=gb&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'BinCleaningAdmin/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get location data');
      }

      const data = await response.json();
      
      // Extract postcode and area info from the response
      const postcode = data.address?.postcode;
      const city = data.address?.city || data.address?.town || data.address?.village;
      const suburb = data.address?.suburb || data.address?.neighbourhood;
      
      if (postcode) {
        setNewPostcode(postcode.toUpperCase());
        
        // Auto-fill area name if we can determine it
        if (city || suburb) {
          const areaName = suburb ? `${suburb}, ${city || 'Unknown'}` : city || 'Unknown';
          setNewAreaName(areaName);
        }
        
        // Auto-validate the detected postcode
        await validatePostcodeLocal(postcode);
      } else {
        throw new Error('Postcode not found for this location');
      }

      setIsDetectingLocation(false);
    } catch (error) {
      console.error('Location detection error:', error);
      alert('Unable to detect postcode from your location. Please enter it manually.');
      setIsDetectingLocation(false);
    }
  };

  const addServiceAreaLocal = async () => {
    if (!newPostcode.trim()) return;

    setIsSaving(true);
    const area = extractPostcodeArea(newPostcode);
    
    if (!area) {
      alert('Please enter a valid postcode format');
      setIsSaving(false);
      return;
    }

    try {
      console.log('🔍 Validating postcode:', newPostcode);
      
      // Validate the postcode first
      const isValid = await validatePostcode(newPostcode);
      
      console.log('✅ Postcode validation result:', isValid);
      
      if (!isValid) {
        alert(`${formatPostcode(newPostcode)} is not a valid UK postcode format. Please check and try again.\n\nExample formats:\n• M1 1AA\n• SW1A 1AA\n• B33 8TH`);
        setIsSaving(false);
        return;
      }

      console.log('📤 Sending postcode to API:', newPostcode);

      // Add to database via API
      const response = await fetch('/api/service-areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postcode: newPostcode,
          areaName: newAreaName || `${area} Area`
        }),
      });

      const result = await response.json();
      
      console.log('📥 API response:', { status: response.status, result });

      if (!response.ok) {
        if (response.status === 409) {
          alert('This postcode area is already in the service list');
        } else {
          console.error('API Error:', result);
          throw new Error(result.error || 'Failed to add service area');
        }
        setIsSaving(false);
        return;
      }

      // Refresh data from database
      refreshServiceData();
      
      // Notify parent component that a postcode was added
      onPostcodeAdded?.();
      
      // Show success feedback
      setValidationResult({
        postcode: formatPostcode(newPostcode),
        isValid: true
      });

      setNewPostcode('');
      setNewAreaName('');
      
      // Clear validation result after 3 seconds
      setTimeout(() => setValidationResult(null), 3000);
      
    } catch (error: any) {
      console.error('❌ Error adding service area:', error);
      
      let errorMessage = 'Unable to add postcode. ';
      
      if (error.name === 'AbortError') {
        errorMessage += 'Request timed out. Please check your internet connection and try again.';
      } else if (error.message?.includes('fetch')) {
        errorMessage += 'Network error. Please check your internet connection and try again.';
      } else if (error.message?.includes('validation')) {
        errorMessage += 'Postcode validation failed. Please check the format and try again.';
      } else {
        errorMessage += error.message || 'Please try again or contact support if the problem persists.';
      }
      
      alert(errorMessage);
    }
    
    setIsSaving(false);
  };

  const toggleServiceArea = async (id: string) => {
    const area = serviceAreas.find(sa => sa.id === id);
    if (!area) return;

    try {
      const response = await fetch('/api/service-areas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          isActive: !area.isActive
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update service area status');
      }

      // Refresh data from database
      refreshServiceData();
    } catch (error: any) {
      console.error('Error updating service area:', error);
      alert('Failed to update service area status. Please try again.');
    }
  };

  const removeServiceAreaLocal = async (id: string) => {
    if (!confirm('Are you sure you want to remove this service area?')) return;

    try {
      const response = await fetch(`/api/service-areas?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete service area');
      }

      // Refresh data from database
      refreshServiceData();
      
      // Notify parent component that data changed
      onPostcodeAdded?.();
    } catch (error: any) {
      console.error('Error deleting service area:', error);
      alert('Failed to delete service area. Please try again.');
    }
  };

  const exportPostcodes = () => {
    const activePostcodes = serviceAreas
      .filter(sa => sa.isActive)
      .map(sa => sa.postcode);
    
    const exportData = {
      postcodes: activePostcodes,
      exportDate: new Date().toISOString(),
      totalAreas: activePostcodes.length
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'service-postcodes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredAreas = serviceAreas.filter(sa =>
    sa.postcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sa.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = serviceAreas.filter(sa => sa.isActive).length;
  const inactiveCount = serviceAreas.filter(sa => !sa.isActive).length;

  return (
    <div className="w-full space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="border rounded-lg p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Service Area Manager</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Manage postcode areas for bin cleaning services</p>
            </div>
          </div>
          <button
            onClick={exportPostcodes}
            className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm"
          >
            <Save className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          <div className="bg-green-50 p-2 sm:p-3 lg:p-4 rounded-lg">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{activeCount}</div>
            <div className="text-xs sm:text-sm text-green-700">Active Areas</div>
          </div>
          <div className="bg-yellow-50 p-2 sm:p-3 lg:p-4 rounded-lg">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">{inactiveCount}</div>
            <div className="text-xs sm:text-sm text-yellow-700">Inactive Areas</div>
          </div>
          <div className="bg-blue-50 p-2 sm:p-3 lg:p-4 rounded-lg">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{serviceAreas.length}</div>
            <div className="text-xs sm:text-sm text-blue-700">Total Areas</div>
          </div>
        </div>
      </div>

      {/* Add New Area */}
      <div className="border rounded-lg p-3 sm:p-4 lg:p-6">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add New Service Area</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Postcode (e.g., SW1A 1AA)
            </label>
            <input
              type="text"
              value={newPostcode}
              onChange={(e) => setNewPostcode(e.target.value.toUpperCase())}
              placeholder="Enter postcode to add service area"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              onKeyPress={(e) => e.key === 'Enter' && addServiceAreaLocal()}
            />
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Area Name (optional)
            </label>
            <input
              type="text"
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
              placeholder="e.g., Central London, Westminster"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              onKeyPress={(e) => e.key === 'Enter' && addServiceAreaLocal()}
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button
            onClick={detectLocationPostcode}
            disabled={isDetectingLocation}
            className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-sm"
          >
            {isDetectingLocation ? (
              <>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Detecting...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Use My Location</span>
              </>
            )}
          </button>
          <button
            onClick={addServiceAreaLocal}
            disabled={isSaving || !newPostcode.trim()}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 sm:space-x-2 text-sm"
          >
            {isSaving ? (
              <>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Validating & Adding...</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Validate & Add Area</span>
              </>
            )}
          </button>
        </div>

        {validationResult && (
          <div className={`mt-3 p-3 rounded-lg flex items-center space-x-2 ${
            validationResult.isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {validationResult.isValid ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>
              {validationResult.isValid 
                ? `${validationResult.postcode} is a valid UK postcode`
                : `${validationResult.postcode} is not a valid UK postcode`
              }
            </span>
          </div>
        )}
      </div>

      {/* Service Areas List */}
      <div className="border rounded-lg p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Service Areas</h2>
          <div className="relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search areas..."
              className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none w-full sm:w-auto"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Postcode</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Area Name</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Status</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden lg:table-cell">Date Added</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAreas.map((area) => (
                <tr key={area.id} className="border-b border-gray-100">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 font-mono font-medium text-xs sm:text-sm">
                    <div className="flex flex-col">
                      <span>{area.postcode}</span>
                      <span className="sm:hidden text-xs text-gray-500">{area.area}</span>
                    </div>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm hidden sm:table-cell">{area.area}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      area.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'border border-gray-300 text-gray-700'
                    }`}>
                      {area.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm hidden lg:table-cell">{area.dateAdded}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => toggleServiceArea(area.id)}
                        className={`px-2 sm:px-3 py-1 rounded text-xs font-medium ${
                          area.isActive
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        <span className="hidden sm:inline">{area.isActive ? 'Deactivate' : 'Activate'}</span>
                        <span className="sm:hidden">{area.isActive ? 'Off' : 'On'}</span>
                      </button>
                      <button
                        onClick={() => removeServiceAreaLocal(area.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded touch-manipulation"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAreas.length === 0 && (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-sm">
              No service areas found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
