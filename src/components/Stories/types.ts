/**
 * STORY GALLERY TYPES
 * 
 * Shared TypeScript interfaces and types for the story gallery system
 * - GalleryImage interface
 * - Story-related prop types
 * - Helper type definitions
 */

export interface GalleryImage {
  /** Image or video source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Full caption for modal, short caption derived from this */
  caption: string;
  /** Optional postcode for location tag */
  postcode?: string;
  /** Media type - image or video */
  type?: 'image' | 'video';
  /** Optional thumbnail URL for videos */
  thumbnail?: string;
}

export interface StoryGalleryProps {
  /** Array of images for the gallery */
  galleryImages: GalleryImage[];
  /** Function to open gallery modal at specific index */
  onOpenGallery: (index: number) => void;
  /** Callback function to send loaded photos to parent component */
  onPhotosLoaded?: (photos: GalleryImage[]) => void;
}

export interface StoryCardData {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Short caption for display on card */
  shortCaption: string;
  /** Full caption for modal */
  fullCaption: string;
}

/**
 * Caption mapping for converting full captions to short versions
 * Used by the getShortCaption utility function
 */
export const CAPTION_MAPPINGS: Record<string, string> = {
  'Professional deep cleaning for all bin types': 'Professional deep cleaning',
  'Before and after - spotless results': 'Before and after results', 
  'Eco-friendly sanitizers and hot water treatment': 'Eco-friendly treatment',
  'Serving homes across the UK': 'Residential service',
  'We handle all types of waste bins': 'All bin types',
  'Same-day collection service available': 'Same-day service'
};

/**
 * Story card dimensions - Instagram/Facebook story style
 */
export const STORY_CARD_DIMENSIONS = {
  width: 160,
  height: 280,
  aspectRatio: '9:16'
} as const;
