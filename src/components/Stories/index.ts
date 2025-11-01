/**
 * STORIES INDEX
 * 
 * Centralized exports for all story-related components
 * Import from this file to access any story component
 */

// Main Components
export { default as SeeOurWorkSection } from './SeeOurWorkSection';
export { default as StoryCard } from './StoryCard';
export { default as StoryCarousel } from './StoryCarousel';

// Types and Interfaces
export type { 
  GalleryImage, 
  StoryGalleryProps, 
  StoryCardData 
} from './types';

export { 
  CAPTION_MAPPINGS, 
  STORY_CARD_DIMENSIONS 
} from './types';

// Utilities
export {
  getShortCaption,
  getOptimizedImageUrl,
  isValidGalleryImage,
  filterValidImages,
  getIndicatorCount
} from './utils';

/**
 * USAGE EXAMPLES:
 * 
 * // Import main component
 * import { SeeOurWorkSection } from '@/components/Stories';
 * 
 * // Import specific components
 * import { StoryCard, StoryCarousel } from '@/components/Stories';
 * 
 * // Import types
 * import type { GalleryImage, StoryGalleryProps } from '@/components/Stories';
 * 
 * // Import utilities
 * import { getShortCaption, filterValidImages } from '@/components/Stories';
 */
