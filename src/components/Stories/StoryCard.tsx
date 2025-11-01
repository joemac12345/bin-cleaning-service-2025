/**
 * STORY CARD COMPONENT
 * 
 * Individual story card for the gallery carousel
 * - 160x280px dimensions (Instagram story style)
 * - Hover effects and gradient overlay
 * - Logo overlay and postcode tag
 * - Click handler for modal opening
 * 
 * Used within SeeOurWorkSection component
 */

'use client';

import Logo from '../Logo';

interface StoryCardProps {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Short caption displayed on card */
  caption: string;
  /** Index in gallery for modal opening */
  index: number;
  /** Click handler function */
  onClick: (index: number) => void;
  /** Optional postcode for location tag */
  postcode?: string;
}

export default function StoryCard({ src, alt, caption, index, onClick, postcode }: StoryCardProps) {
  return (
    <button
      onClick={() => onClick(index)}
      className="flex-none w-[160px] snap-start cursor-pointer group"
    >
      <div className="relative h-[280px] bg-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] rounded-2xl">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Logo Overlay - Top Right */}
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
            <div className="text-[8px] font-bold">
              <span className="text-gray-800">The</span>
              <span className="text-emerald-500">bin</span>
            </div>
          </div>
        </div>
        
        {/* Postcode Tag - Top Left */}
        {postcode && (
          <div className="absolute top-3 left-3">
            <span className="bg-[#3B4044]/90 text-white text-[10px] font-medium px-2 py-1 rounded-full backdrop-blur-sm shadow-sm">
              {postcode}
            </span>
          </div>
        )}
        

        
        {/* Hover Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
          </div>
        </div>
      </div>
    </button>
  );
}
