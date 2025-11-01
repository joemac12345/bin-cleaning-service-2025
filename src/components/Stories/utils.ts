/**
 * STORY UTILITIES
 * 
 * Helper functions for the story gallery system
 * - Caption processing
 * - Image optimization
 * - Gallery state management
 */

import { CAPTION_MAPPINGS } from './types';

/**
 * Convert full caption to short version for story cards
 * @param caption - Full caption text
 * @returns Short version suitable for story card display
 */
export function getShortCaption(caption: string): string {
  return CAPTION_MAPPINGS[caption] || caption;
}

/**
 * Generate optimized image URL with query parameters
 * @param src - Original image source
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(src: string, width: number, height: number): string {
  // For now, return original URL
  // In production, you might add image optimization service parameters
  return src;
}

/**
 * Validate gallery image object
 * @param image - Image object to validate
 * @returns Boolean indicating if image is valid
 */
export function isValidGalleryImage(image: any): boolean {
  return (
    image &&
    typeof image.src === 'string' &&
    typeof image.alt === 'string' &&
    typeof image.caption === 'string' &&
    image.src.length > 0 &&
    image.alt.length > 0 &&
    image.caption.length > 0
  );
}

/**
 * Filter and validate gallery images array
 * @param images - Array of image objects
 * @returns Filtered array of valid images
 */
export function filterValidImages(images: any[]): any[] {
  return images.filter(isValidGalleryImage);
}

/**
 * Calculate scroll indicator count based on image count
 * @param imageCount - Total number of images
 * @returns Number of indicators to display (max 5)
 */
export function getIndicatorCount(imageCount: number): number {
  return Math.min(imageCount, 5);
}
