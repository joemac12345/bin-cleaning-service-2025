/**
 * SEE OUR WORK SECTION COMPONENT
 * 
 * Main section component that combines:
 * - Section header with title and description
 * - Story cards carousel with individual components
 * - Modular architecture using StoryCard and StoryCarousel
 * - Dynamic photo loading from database
 * 
 * Usage: Can be used with or without galleryImages prop (will load from DB if not provided)
 * Updated: 2025-11-01 - Netlify deployment ready
 */

'use client';

import { useState, useEffect } from 'react';
import StoryCard from './StoryCard';
import StoryCarousel from './StoryCarousel';
import { getShortCaption } from './utils';
import type { StoryGalleryProps, GalleryImage } from './types';

interface DatabasePhoto {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  type: 'before' | 'after' | 'process';
  customer_name?: string; // Database uses snake_case
  location?: string;
  created_at: string; // Database field name
  is_public: boolean; // Database uses snake_case
}

export default function SeeOurWorkSection({ galleryImages, onOpenGallery, onPhotosLoaded }: Partial<StoryGalleryProps>) {
  const [dbPhotos, setDbPhotos] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load photos from database if no galleryImages provided
  useEffect(() => {
    console.log('🚀 useEffect triggered - galleryImages:', galleryImages);
    if (!galleryImages) {
      console.log('📞 Calling loadPhotosFromDB...');
      loadPhotosFromDB();
    } else {
      console.log('⚠️ Skipping database load - galleryImages provided');
    }
  }, [galleryImages]);

  // Load photos on component mount (backup in case useEffect doesn't trigger)
  useEffect(() => {
    console.log('🎬 Component mounted - loading photos immediately');
    if (!galleryImages) {
      loadPhotosFromDB();
    }
  }, []); // Empty dependency array - runs only on mount

  // Add periodic refresh to check for new photos
  useEffect(() => {
    if (!galleryImages) {
      // Refresh every 30 seconds to check for new photos
      const interval = setInterval(() => {
        console.log('⏰ Periodic refresh triggered');
        loadPhotosFromDB();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [galleryImages]);

  const loadPhotosFromDB = async () => {
    console.log('🖼️ SeeOurWorkSection: Loading photos from database...');
    setIsLoading(true);
    try {
      const response = await fetch('/api/photos');
      console.log('📡 API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Raw API data:', data);
        
        const publicPhotos = data.photos?.filter((photo: DatabasePhoto) => photo.is_public) || [];
        console.log('🔍 Public photos found:', publicPhotos.length);
        console.log('📋 Public photos:', publicPhotos);
        
        // Convert database photos to GalleryImage format
        const convertedPhotos: GalleryImage[] = publicPhotos.map((photo: DatabasePhoto) => ({
          src: photo.url,
          alt: `${photo.type} cleaning photo${photo.customer_name ? ` for ${photo.customer_name}` : ''}`,
          caption: photo.caption + (photo.location ? ` - ${photo.location}` : '')
        }));
        
        console.log('✅ Converted photos for display:', convertedPhotos);
        setDbPhotos(convertedPhotos);
        
        // Send photos to parent component for modal
        if (onPhotosLoaded) {
          console.log('📤 Sending photos to parent component for modal');
          onPhotosLoaded(convertedPhotos);
        }
      } else {
        console.error('❌ API request failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading photos from database:', error);
      // Fallback to empty array if API fails
      setDbPhotos([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Use provided galleryImages or loaded dbPhotos
  const photosToDisplay = galleryImages || dbPhotos;
  const handleOpenGallery = onOpenGallery || (() => {});
  
  console.log('🎯 SeeOurWorkSection render:', {
    galleryImages: galleryImages?.length || 0,
    dbPhotos: dbPhotos.length,
    photosToDisplay: photosToDisplay.length,
    isLoading
  });
  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            From Disgusting to Spotless! 🤢➡️✨
          </h2>
          {!galleryImages && (
            <button
              onClick={() => {
                console.log('🔘 Manual refresh clicked');
                loadPhotosFromDB();
              }}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
              disabled={isLoading}
            >
              {isLoading ? '🔄' : '↻'} Refresh
            </button>
          )}
        </div>
        <p className="text-sm md:text-base text-gray-600 mb-6">
          Real transformations from customers just like you. These bins went from health hazards to hygienically clean in just one visit. Tap any photo to see the full before & after story!
        </p>
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B4044]"></div>
            <p className="text-gray-500 mt-2">Loading photos...</p>
          </div>
        )}
        
        {/* Story Cards Carousel */}
        {!isLoading && photosToDisplay.length > 0 && (
          <StoryCarousel itemCount={photosToDisplay.length}>
            {photosToDisplay.map((image, index) => (
              <StoryCard
                key={index}
                src={image.src}
                alt={image.alt}
                caption={getShortCaption(image.caption)}
                index={index}
                onClick={handleOpenGallery}
              />
            ))}
          </StoryCarousel>
        )}
        
        {/* Photo Count */}
        {!isLoading && photosToDisplay.length > 0 && (
          <p className="text-xs text-gray-500 mb-4">
            Showing {photosToDisplay.length} customer transformation{photosToDisplay.length !== 1 ? 's' : ''}
          </p>
        )}
        
        {/* Empty State */}
        {!isLoading && photosToDisplay.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No photos available yet</p>
            <p className="text-sm">Check back soon for amazing before & after transformations!</p>
          </div>
        )}
      </div>
    </div>
  );
}


