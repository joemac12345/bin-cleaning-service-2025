/**
 * SIMPLE TITLE COMPONENT
 * 
 * A basic component for displaying a title and optional subtitle.
 * Clean and minimal implementation.
 */

'use client';

import { useState } from 'react';
import { titleConfig } from '@/config/titleConfig';

interface TitleSubtitleProps {
  avatarText?: string;
  avatarImage?: string; // Path to image in public folder (e.g., '/logo.png')
  header?: string;
  postedBy?: string;
  fullText?: string;
  shortText?: string;
  primaryColor?: string;
  avatarBgColor?: string;
  backgroundColor?: string; // Background color for entire component
  className?: string;
}

export default function TitleSubtitle({
  avatarText = titleConfig.avatarText,
  avatarImage = titleConfig.avatarImage,
  header = titleConfig.header,
  postedBy = titleConfig.postedBy,
  fullText = titleConfig.fullText,
  shortText = titleConfig.shortText,
  primaryColor = titleConfig.colors.primary,
  avatarBgColor = titleConfig.colors.avatarBg,
  backgroundColor = 'transparent',
  className = ''
}: TitleSubtitleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Check if there's actual text content to display
  const hasTextContent = fullText && fullText.trim().length > 0 && shortText && shortText.trim().length > 0;
  
  return (
    <div className={`w-full px-3 sm:px-4 md:px-6 ${className}`} style={{ paddingBottom: '10px', backgroundColor }}>
      {/* Profile-style header */}
      <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ backgroundColor: avatarImage ? 'transparent' : avatarBgColor }}>
          {avatarImage ? (
            <img 
              src={avatarImage} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-xs sm:text-sm">{avatarText}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl mb-1 sm:mb-2 leading-tight capitalize" style={{ color: primaryColor }}>
            {header}
          </h2>
          <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">
            {postedBy}
          </p>
        </div>
      </div>
      
      {/* Read More content - only show if there's text */}
      {hasTextContent && (
        <div className="mb-2">
          <p 
            className="text-xs sm:text-sm leading-relaxed cursor-pointer hover:text-gray-800 transition-colors duration-200"
            onClick={toggleExpanded}
            title="Click to read more/less"
          >
            {/* Description text with read more */}
            <span className="text-gray-600 leading-relaxed" style={{ color: primaryColor }}>
              {isExpanded ? fullText : shortText}
            </span>
            <span className="ml-1 sm:ml-2 text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm">
              {isExpanded ? 'Read Less' : 'Read More'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
