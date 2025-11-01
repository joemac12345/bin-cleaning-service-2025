/**
 * STORY CAROUSEL COMPONENT
 * 
 * Horizontal scrolling carousel for story cards
 * - Snap scrolling with hidden scrollbars
 * - Scroll indicators and mobile swipe hints
 * - Responsive gap and padding
 * 
 * Used within SeeOurWorkSection component
 */

'use client';

import { ReactNode } from 'react';

interface StoryCarouselProps {
  /** Story card components to display */
  children: ReactNode;
  /** Total number of items for indicators */
  itemCount: number;
}

export default function StoryCarousel({ children, itemCount }: StoryCarouselProps) {
  // Generate scroll indicators based on item count
  const indicators = Array.from({ length: Math.min(itemCount, 3) }, (_, index) => (
    <div 
      key={index} 
      className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-[#3B4044]' : 'bg-gray-300'}`}
    />
  ));

  return (
    <div className="relative -mx-4">
      {/* Carousel Container */}
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4">
        {children}
      </div>

      {/* Scroll Indicators */}
      <div className="flex gap-2 mt-6 px-4 justify-center md:justify-start">
        {indicators}
      </div>

      {/* Swipe Hint - Mobile Only */}
      <p className="text-sm text-gray-500 mt-4 md:hidden text-center">
        ← Swipe to see all photos
      </p>

      {/* Scrollbar Hide Styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
