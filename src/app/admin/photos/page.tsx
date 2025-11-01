/**
 * ADMIN PHOTOS PAGE
 * 
 * Mobile-friendly photo management for field workers:
 * - Take photos directly with camera
 * - Upload before/after photos with descriptions
 * - Manage existing gallery photos
 * - Real-time preview and organization
 * 
 * Features:
 * - Camera integration for on-site use
 * - Before/after photo pairing
 * - Customer info and location tagging
 * - Instant upload to database
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Trash2, Edit, Save, X, Eye, MapPin, Calendar, User } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  type: 'before' | 'after' | 'process';
  customerName?: string;
  location?: string;
  date: string;
  isPublic: boolean;
}

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [newPhoto, setNewPhoto] = useState({
    caption: '',
    type: 'before' as 'before' | 'after' | 'process',
    customerName: '',
    location: '',
    isPublic: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load existing photos on mount
  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      console.log('Loading photos from database...');
      const response = await fetch('/api/photos');
      console.log('Photo fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Photo data received:', data);
        console.log('Number of photos:', data.photos?.length || 0);
        setPhotos(data.photos || []);
      } else {
        console.error('Failed to fetch photos:', response.statusText);
        const errorData = await response.text();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const handleFileSelect = (files: FileList | null, source: 'upload' | 'camera') => {
    if (!files) return;
    setSelectedFiles(files);
    
    // Show preview
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // You can add preview logic here if needed
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const uploadPhoto = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select a photo first');
      return;
    }
    
    if (!newPhoto.caption.trim()) {
      alert('Please add a caption');
      return;
    }
    
    setIsUploading(true);
    
    try {
      console.log('Starting photo upload...');
      const formData = new FormData();
      formData.append('photo', selectedFiles[0]);
      formData.append('caption', newPhoto.caption);
      formData.append('type', newPhoto.type);
      formData.append('customerName', newPhoto.customerName);
      formData.append('location', newPhoto.location);
      formData.append('isPublic', newPhoto.isPublic.toString());
      
      console.log('Sending request to /api/photos');
      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);
      
      if (response.ok && result.success) {
        // Show success message
        const successMessage = newPhoto.isPublic 
          ? 'Photo uploaded successfully! It will appear on the website automatically.' 
          : 'Photo uploaded successfully and saved as private.';
        alert(successMessage);
        
        // Add the new photo to the beginning of the list
        setPhotos(prev => [result.photo, ...prev]);
        
        // Reset form
        setSelectedFiles(null);
        setNewPhoto({
          caption: '',
          type: 'before',
          customerName: '',
          location: '',
          isPublic: true
        });
        
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
        
        // Reload photos to ensure sync with database
        loadPhotos();
      } else {
        console.error('Upload failed:', result);
        alert(`Upload failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload error: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  const deletePhoto = async (id: string) => {
    if (!confirm('Delete this photo? This cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/photos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPhotos(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const togglePublic = async (id: string, isPublic: boolean) => {
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic }),
      });
      
      if (response.ok) {
        setPhotos(prev => prev.map(p => 
          p.id === id ? { ...p, isPublic } : p
        ));
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                📸 Photo Manager
              </h1>
              <p className="text-gray-600">
                Take photos on-site and manage your work gallery
              </p>
            </div>
            <button
              onClick={loadPhotos}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span>🔄</span>
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Photo</h2>
          
          {/* Camera and Upload Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#3B4044] rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Camera className="w-8 h-8 text-[#3B4044] mb-2" />
              <span className="font-medium text-[#3B4044]">Take Photo</span>
              <span className="text-sm text-gray-500">Use camera</span>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-500 mb-2" />
              <span className="font-medium text-gray-700">Upload File</span>
              <span className="text-sm text-gray-500">Choose from gallery</span>
            </button>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFileSelect(e.target.files, 'camera')}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files, 'upload')}
            className="hidden"
          />

          {/* Photo Details Form */}
          {selectedFiles && (
            <div className="border rounded-xl p-4 mb-4 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-3">Photo Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo Type
                  </label>
                  <select
                    value={newPhoto.type}
                    onChange={(e) => setNewPhoto(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#3B4044] focus:border-[#3B4044]"
                  >
                    <option value="before">Before Cleaning</option>
                    <option value="after">After Cleaning</option>
                    <option value="process">During Process</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={newPhoto.customerName}
                    onChange={(e) => setNewPhoto(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Customer name (optional)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#3B4044] focus:border-[#3B4044]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newPhoto.location}
                    onChange={(e) => setNewPhoto(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Area or postcode"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#3B4044] focus:border-[#3B4044]"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newPhoto.isPublic}
                    onChange={(e) => setNewPhoto(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="w-4 h-4 text-[#3B4044] border-gray-300 rounded focus:ring-[#3B4044]"
                  />
                  <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                    Show on website
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption
                </label>
                <textarea
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Describe the transformation..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#3B4044] focus:border-[#3B4044]"
                />
              </div>

              <button
                onClick={uploadPhoto}
                disabled={isUploading || !newPhoto.caption}
                className="w-full mt-4 bg-[#3B4044] hover:bg-[#2a2d30] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {isUploading ? 'Uploading...' : 'Save Photo'}
              </button>
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">🐛 Debug Info</h3>
          <div className="text-xs space-y-1 text-yellow-700">
            <p>Photos loaded: {photos.length}</p>
            <p>Last update: {new Date().toLocaleTimeString()}</p>
            <p>API URL: /api/photos</p>
            <button 
              onClick={loadPhotos}
              className="mt-2 px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-yellow-800 text-xs"
            >
              🔄 Force Reload Photos
            </button>
          </div>
        </div>

        {/* Photos Gallery */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Photo Gallery ({photos.length} photos)
          </h2>
          
          {photos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No photos yet. Start by taking your first before & after photos!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={photo.thumbnail || photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Photo Type Badge */}
                    <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded ${
                      photo.type === 'before' ? 'bg-red-100 text-red-800' :
                      photo.type === 'after' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {photo.type}
                    </div>

                    {/* Public/Private Badge */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => togglePublic(photo.id, !photo.isPublic)}
                        className={`p-1 rounded-full ${
                          photo.isPublic ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setEditingId(photo.id)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Photo Info */}
                  <div className="mt-2 text-sm">
                    <p className="font-medium text-gray-900 truncate">{photo.caption}</p>
                    {photo.customerName && (
                      <p className="text-gray-500 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {photo.customerName}
                      </p>
                    )}
                    {photo.location && (
                      <p className="text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {photo.location}
                      </p>
                    )}
                    <p className="text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(photo.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
