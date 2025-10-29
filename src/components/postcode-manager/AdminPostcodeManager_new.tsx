'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { 
  addServiceArea as addServiceAreaToService, 
  updateServiceAreaStatus, 
  removeServiceArea as removeServiceAreaFromService,
  validatePostcode,
  formatPostcode,
  extractPostcodeArea
} from '@/components/postcode-manager/services/postcodeService';
import usePostcodeService from '@/components/postcode-manager/hooks/usePostcodeService';
import PostcodeCard from './PostcodeCard';
import AddPostcodeModal from './AddPostcodeModal';
import PostcodeBottomMenu from '../PostcodeBottomMenu';

interface AdminPostcodeManagerProps {
  onPostcodeAdded?: () => void;
}

export default function AdminPostcodeManager({ onPostcodeAdded }: AdminPostcodeManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use the new hook for postcode service management
  const { serviceAreas, refresh: refreshServiceData } = usePostcodeService();

  const handleAddPostcode = async (postcode: string, areaName: string) => {
    try {
      const area = extractPostcodeArea(postcode);
      const isValid = await validatePostcode(postcode);

      if (!isValid) {
        alert(`${formatPostcode(postcode)} is not a valid UK postcode format. Please check and try again.\n\nExample formats:\n• M1 1AA\n• SW1A 1AA\n• B33 8TH`);
        return;
      }

      console.log('📤 Sending postcode to API:', postcode);
      
      const response = await fetch('/api/service-areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postcode: postcode,
          areaName: areaName || `${area} Area`
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
        return;
      }

      // Refresh data from database
      refreshServiceData();
      
      // Notify parent component that a postcode was added
      onPostcodeAdded?.();
      
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

  const removeServiceArea = async (id: string) => {
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
  const totalCount = serviceAreas.length;

  return (
    <div className="w-full pb-32">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-black to-zinc-800 dark:from-zinc-900 dark:to-black rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Service Area Manager</h1>
              <p className="text-zinc-300 mt-1">Manage postcode areas for bin cleaning services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {totalCount === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No service areas yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Add your first postcode area to get started</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
          >
            Add First Area
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAreas.map((area) => (
            <PostcodeCard
              key={area.id}
              id={area.id}
              postcode={area.postcode}
              area={area.area}
              isActive={area.isActive}
              dateAdded={area.dateAdded}
              onToggle={toggleServiceArea}
              onRemove={removeServiceArea}
            />
          ))}
        </div>
      )}

      {/* Empty Search State */}
      {totalCount > 0 && filteredAreas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No service areas match your search</p>
        </div>
      )}

      {/* Modal */}
      <AddPostcodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPostcode}
      />

      {/* Bottom Menu */}
      <PostcodeBottomMenu
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        totalCount={totalCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setIsModalOpen(true)}
        onExport={exportPostcodes}
      />
    </div>
  );
}
