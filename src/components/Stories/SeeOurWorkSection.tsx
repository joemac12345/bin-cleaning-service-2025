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
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight } from 'lucide-react';
import StoryCard from './StoryCard';
import StoryCarousel from './StoryCarousel';
import StoryGalleryModal from './StoryGalleryModal';
import TitleSubtitle from '../TitleSubtitle';
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
  media_type?: 'image' | 'video'; // Database field for media type
  platform?: string; // Social media platform (youtube, tiktok, instagram, facebook)
  video_id?: string; // Platform-specific video ID
}

export default function SeeOurWorkSection({ galleryImages, onOpenGallery, onPhotosLoaded }: Partial<StoryGalleryProps>) {
  const [dbPhotos, setDbPhotos] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const router = useRouter();

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
      // Refresh every hour (3600000ms) to check for new photos
      const interval = setInterval(() => {
        console.log('⏰ Periodic refresh triggered');
        loadPhotosFromDB();
      }, 3600000); // 1 hour = 60 minutes × 60 seconds × 1000 milliseconds

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
        
        // Convert database photos to GalleryImage format (filter out unsupported platforms)
        const convertedPhotos: GalleryImage[] = publicPhotos.map((photo: DatabasePhoto) => {
          console.log('🔄 Processing photo:', photo);
          let embedUrl = photo.url;
          let thumbnailUrl = photo.thumbnail;
          
          // Only support YouTube videos - convert to embeddable format
          if (photo.platform === 'youtube' && photo.video_id) {
            embedUrl = `https://www.youtube.com/embed/${photo.video_id}?autoplay=0&mute=1&rel=0`;
            thumbnailUrl = thumbnailUrl || `https://img.youtube.com/vi/${photo.video_id}/maxresdefault.jpg`;
          } else if (photo.media_type === 'video' && photo.url.includes('youtube.com')) {
            // Fallback: try to extract YouTube ID from URL if platform data is missing
            const match = photo.url.match(/[?&]v=([^&]+)/);
            if (match) {
              embedUrl = `https://www.youtube.com/embed/${match[1]}?autoplay=0&mute=1&rel=0`;
              thumbnailUrl = `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
            }
          } else if (photo.media_type === 'video' && photo.platform && photo.platform !== 'youtube' && photo.platform !== 'direct_upload' && photo.platform !== 'file_upload') {
            // Skip unsupported video platforms
            console.warn(`⚠️ Unsupported video platform: ${photo.platform}. Only YouTube videos are supported.`);
            return null; // This will be filtered out
          }

          const result = {
            src: embedUrl,
            alt: `${photo.type} cleaning ${photo.media_type || 'photo'}${photo.customer_name ? ` for ${photo.customer_name}` : ''}`,
            caption: photo.caption,
            postcode: photo.location, // Extract postcode from location field
            type: photo.media_type || 'image',
            thumbnail: thumbnailUrl,
            platform: photo.platform,
            videoId: photo.video_id
          };
          console.log('✅ Converted photo:', result);
          return result;
        }).filter(Boolean); // Remove null values (unsupported platforms)
        
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
  
  // Handle opening gallery modal
  const handleOpenGallery = (index: number) => {
    console.log('📸 Opening gallery at index:', index);
    setSelectedImageIndex(index);
    setIsModalOpen(true);
    
    // Call parent handler if provided
    if (onOpenGallery) {
      onOpenGallery(index);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  console.log('🎯 SeeOurWorkSection render:', {
    galleryImages: galleryImages?.length || 0,
    dbPhotosCount: dbPhotos.length,
    photosToDisplay: photosToDisplay.length,
    isLoading,
    dbPhotosData: dbPhotos
  });
  return (
    <div className="pb-16">
      <div className="max-w-6xl mx-auto px-4">
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
                postcode={image.postcode}
                type={image.type}
                thumbnail={image.thumbnail}
                platform={image.platform}
                videoId={image.videoId}
              />
            ))}
          </StoryCarousel>
        )}
        
        {/* Photo Count */}
        {!isLoading && photosToDisplay.length > 0 && (
          <p className="text-xs text-gray-500 mb-6">
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

      {/* Story Gallery Modal */}
      <StoryGalleryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        images={photosToDisplay}
        initialIndex={selectedImageIndex}
      />
    </div>
  );
}


