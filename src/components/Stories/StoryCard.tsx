/**
 * STORY CARD COMPONENT
 * 
 * Individual story card for the gallery carousel
 * - 160x280px dimensions (Instagram story style)
 * - Hover effects and gradient overlay
 * - Click handler for modal opening
 * 
 * Used within SeeOurWorkSection component
 */

'use client';

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
}

export default function StoryCard({ src, alt, caption, index, onClick }: StoryCardProps) {
  return (
    <button
      onClick={() => onClick(index)}
      className="flex-none w-[160px] snap-start cursor-pointer group"
    >
      <div className="relative h-[280px] bg-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white p-2">
          <p className="text-xs font-medium leading-tight drop-shadow-sm">
            {caption}
          </p>
        </div>
        
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
