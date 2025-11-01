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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newPhoto, setNewPhoto] = useState({
    caption: '',
    type: 'before' as 'before' | 'after' | 'process',
    customerName: '',
    location: '',
    isPublic: true
  });
  const [videoUrl, setVideoUrl] = useState('');
  const [isUrlMode, setIsUrlMode] = useState(false);
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
    if (!files || files.length === 0) {
      setSelectedFiles(null);
      setPreviewImage(null);
      return;
    }
    
    const file = files[0];
    
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert(`File too large. Please select a file smaller than 50MB. Current file: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
      return;
    }
    
    // Check file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }
    
    setSelectedFiles(files);
    
    // Create preview for images
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // For videos, we'll show a video icon or thumbnail
      setPreviewImage(null);
    }
  };

  const clearPreview = () => {
    setSelectedFiles(null);
    setPreviewImage(null);
    setVideoUrl('');
    setIsUrlMode(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Function to validate YouTube URLs only
  const processSocialMediaUrl = (url: string) => {
    const trimmedUrl = url.trim();
    
    // Only allow YouTube videos (including Shorts)
    if (trimmedUrl.includes('youtube.com') || trimmedUrl.includes('youtu.be')) {
      const videoId = extractYouTubeId(trimmedUrl);
      return {
        platform: 'youtube',
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        isValid: !!videoId,
        error: videoId ? null : 'Invalid YouTube URL format'
      };
    }
    
    // Reject all other platforms with specific error messages
    if (trimmedUrl.includes('tiktok.com')) {
      return { platform: 'tiktok', isValid: false, error: 'TikTok videos are not supported. Please use YouTube videos only.' };
    }
    
    if (trimmedUrl.includes('instagram.com')) {
      return { platform: 'instagram', isValid: false, error: 'Instagram videos are not supported. Please use YouTube videos only.' };
    }
    
    if (trimmedUrl.includes('facebook.com') || trimmedUrl.includes('fb.watch')) {
      return { platform: 'facebook', isValid: false, error: 'Facebook videos are not supported. Please use YouTube videos only.' };
    }
    
    return { platform: 'unknown', isValid: false, error: 'Only YouTube video URLs are supported. Please provide a valid YouTube URL.' };
  };

  const extractYouTubeId = (url: string) => {
    // Handle YouTube Shorts URLs
    let match = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    
    // Handle regular YouTube URLs (watch, youtu.be, embed)
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Removed TikTok, Instagram, and Facebook extraction functions
  // Only YouTube is supported

  const uploadPhoto = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select a file first');
      return;
    }
    
    if (!newPhoto.caption.trim()) {
      alert('Please add a caption');
      return;
    }
    
    const file = selectedFiles[0];
    const isVideo = file.type.startsWith('video/');
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      console.log(`Starting ${isVideo ? 'video' : 'photo'} upload...`, {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
        type: file.type
      });

      const formData = new FormData();
      formData.append('photo', file);
      formData.append('caption', newPhoto.caption);
      formData.append('type', newPhoto.type);
      formData.append('customerName', newPhoto.customerName);
      formData.append('location', newPhoto.location);
      formData.append('isPublic', newPhoto.isPublic.toString());
      formData.append('media_type', isVideo ? 'video' : 'image');
      
      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
            console.log(`Upload progress: ${progress}%`);
          }
        };
        
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(result);
            } catch (e) {
              reject(new Error('Invalid response format'));
            }
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.ontimeout = () => reject(new Error('Upload timeout'));
        
        xhr.open('POST', '/api/photos');
        xhr.timeout = 120000; // 2 minute timeout
        xhr.send(formData);
      });
      
      const result = await uploadPromise as any;
      console.log('Upload response:', result);
      
      if (result.success) {
        // Show success message
        const fileType = isVideo ? 'Video' : 'Photo';
        const successMessage = newPhoto.isPublic 
          ? `${fileType} uploaded successfully! It will appear on the website automatically.` 
          : `${fileType} uploaded successfully and saved as private.`;
        alert(successMessage);
        
        // Add the new photo to the beginning of the list
        setPhotos(prev => [result.photo, ...prev]);
        
        // Reset form and clear preview
        clearPreview();
        setNewPhoto({
          caption: '',
          type: 'before',
          customerName: '',
          location: '',
          isPublic: true
        });
        
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
      setUploadProgress(0);
    }
  };

  const uploadVideoUrl = async () => {
    if (!videoUrl.trim()) {
      alert('Please enter a video URL');
      return;
    }
    
    if (!newPhoto.caption.trim()) {
      alert('Please add a caption');
      return;
    }

    const processedUrl = processSocialMediaUrl(videoUrl);
    if (!processedUrl.isValid) {
      alert(processedUrl.error || 'Please enter a valid YouTube video URL');
      return;
    }

    setIsUploading(true);

    try {
      console.log('Uploading video URL:', processedUrl);

      const videoData = {
        url: processedUrl.embedUrl || videoUrl,
        thumbnail: processedUrl.thumbnail || videoUrl,
        caption: newPhoto.caption,
        type: newPhoto.type,
        customerName: newPhoto.customerName,
        location: newPhoto.location,
        isPublic: newPhoto.isPublic,
        media_type: 'video',
        platform: processedUrl.platform,
        video_id: processedUrl.videoId
      };

      const response = await fetch('/api/photos/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Video URL added successfully!');
        setPhotos(prev => [result.photo, ...prev]);
        clearPreview();
        setNewPhoto({
          caption: '',
          type: 'before',
          customerName: '',
          location: '',
          isPublic: true
        });
        loadPhotos();
      } else {
        alert(`Upload failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Video URL upload error:', error);
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
      
      {/* Hidden file inputs for bottom menu */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={(e) => handleFileSelect(e.target.files, 'upload')}
        className="hidden"
      />

      {/* Photo Upload Modal - appears when photo is selected or URL mode */}
      {(selectedFiles || isUrlMode) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {isUrlMode ? 'Add Video URL' : 'Add Photo Details'}
                </h3>
                <button
                  onClick={clearPreview}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Video URL Input */}
              {isUrlMode && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL (YouTube, TikTok, Instagram, Facebook)
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or https://tiktok.com/@user/video/..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#3B4044] focus:border-[#3B4044]"
                  />
                  {videoUrl && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <strong>Platform:</strong> {processSocialMediaUrl(videoUrl).platform || 'Unknown'}
                      <br />
                      <strong>Valid:</strong> {processSocialMediaUrl(videoUrl).isValid ? '✅ Yes' : '❌ No'}
                    </div>
                  )}
                </div>
              )}

              {/* File Preview */}
              {selectedFiles && (
                <div className="mb-4">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          📹
                        </div>
                        <p className="text-sm text-gray-600">{selectedFiles[0]?.name}</p>
                        <p className="text-xs text-gray-500">
                          {((selectedFiles[0]?.size || 0) / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Uploading...</span>
                    <span className="text-sm text-gray-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#3B4044] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Form */}
              <div className="space-y-4">
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
                    Location/Postcode
                  </label>
                  <input
                    type="text"
                    value={newPhoto.location}
                    onChange={(e) => setNewPhoto(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Area or postcode"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#3B4044] focus:border-[#3B4044]"
                  />
                </div>

                <div>
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

              {/* Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={clearPreview}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={isUrlMode ? uploadVideoUrl : uploadPhoto}
                  disabled={isUploading || !newPhoto.caption.trim() || (isUrlMode && !videoUrl.trim())}
                  className="flex-1 bg-[#3B4044] hover:bg-[#2a2d30] disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  {isUploading ? 'Saving...' : (isUrlMode ? 'Save Video URL' : 'Save Photo')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Menu - Fixed position for all devices */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center px-4 py-2 space-x-4">
          {/* Camera Button */}
          <button
            onClick={() => {
              fileInputRef.current?.click();
              // Simulate camera capture preference if supported
              if (fileInputRef.current) {
                fileInputRef.current.setAttribute('capture', 'environment');
              }
            }}
            className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors shadow-md"
            title="Take Photo"
          >
            <Camera className="w-5 h-5" />
          </button>
          
          {/* Upload Button */}
          <button
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.removeAttribute('capture');
                fileInputRef.current.click();
              }
            }}
            className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors shadow-md"
            title="Upload Photo"
          >
            <Upload className="w-5 h-5" />
          </button>
          
          {/* Video URL Button */}
          <button
            onClick={() => {
              setIsUrlMode(true);
              setVideoUrl('');
            }}
            className="flex items-center justify-center w-12 h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-colors shadow-md"
            title="Add Video URL"
          >
            🔗
          </button>
          
          {/* Photo Count Badge */}
          <div className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
            {photos.length} photos
          </div>
        </div>
      </div>
    </div>
  );
}
