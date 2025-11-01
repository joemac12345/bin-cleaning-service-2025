/**
 * SEE OUR WORK SECTION COMPONENT
 * 
 * Main section component that combines:
 * - Section header with title and description
 * - Story cards carousel with individual components
 * - Modular architecture using StoryCard and StoryCarousel
 * 
 * Usage: Pass galleryImages array and openGallery function as props
 */

'use client';

import StoryCard from './StoryCard';
import StoryCarousel from './StoryCarousel';
import { getShortCaption } from './utils';
import type { StoryGalleryProps, GalleryImage } from './types';

export default function SeeOurWorkSection({ galleryImages, onOpenGallery }: StoryGalleryProps) {
  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          See Our Work
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-6">
          Check out real results from our professional bin cleaning service
        </p>
        
        {/* Story Cards Carousel */}
        <StoryCarousel itemCount={galleryImages.length}>
          {galleryImages.map((image, index) => (
            <StoryCard
              key={index}
              src={image.src}
              alt={image.alt}
              caption={getShortCaption(image.caption)}
              index={index}
              onClick={onOpenGallery}
            />
          ))}
        </StoryCarousel>
      </div>
    </div>
  );
}


