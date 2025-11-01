/**
 * STORY GALLERY MODAL
 * 
 * Full-screen modal for viewing story photos and videos
 * - Opens when clicking on story cards
 * - Displays all photos/videos in scrollable view
 * - Supports images and embedded videos (YouTube, etc.)
 * - Swipe navigation and keyboard controls
 * - CTA button to check postcode
 * 
 * Features:
 * - Full-screen overlay with backdrop blur
 * - Auto-scroll to selected image
 * - Video playback support
 * - Postcode badges on each photo
 * - Mobile-optimized controls
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import type { GalleryImage } from './types';

interface StoryGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  initialIndex?: number;
}

// Inline Postcode Checker Form Component
interface PostcodeCheckerFormProps {
  onServiceAvailable: (postcode: string) => void;
  onWaitlist: (postcode: string) => void;
}

function PostcodeCheckerForm({ onServiceAvailable, onWaitlist }: PostcodeCheckerFormProps) {
  const [postcode, setPostcode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');

  const formatPostcode = (pc: string) => {
    const cleaned = pc.replace(/\s/g, '').toUpperCase();
    if (cleaned.length > 3) {
      return cleaned.slice(0, -3) + ' ' + cleaned.slice(-3);
    }
    return cleaned;
  };

  const isValidUKPostcodeFormat = (pc: string): boolean => {
    const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/;
    return ukPostcodeRegex.test(pc.replace(/\s+/g, ' ').toUpperCase());
  };

  const checkPostcode = async () => {
    if (!postcode.trim()) {
      setError('Please enter a postcode');
      return;
    }

    const formattedPostcode = formatPostcode(postcode.trim());
    
    if (!isValidUKPostcodeFormat(formattedPostcode)) {
      setError('Please enter a valid UK postcode (e.g., SW1A 1AA)');
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      const response = await fetch(`/api/postcodes?postcode=${encodeURIComponent(formattedPostcode)}`);
      
      if (!response.ok) {
        throw new Error('Service unavailable');
      }

      const data = await response.json();

      if (data.isValid) {
        onServiceAvailable(formattedPostcode);
      } else {
        onWaitlist(formattedPostcode);
      }
    } catch (err) {
      setError('Unable to check postcode. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isChecking) {
      checkPostcode();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="postcode-input" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your postcode
        </label>
        <input
          id="postcode-input"
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          placeholder="e.g., SW1A 1AA"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder-gray-400"
          disabled={isChecking}
          autoFocus
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        onClick={checkPostcode}
        disabled={isChecking || !postcode.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isChecking ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Checking...</span>
          </>
        ) : (
          <>
            <span>Check Availability</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        We'll instantly check if we service your area
      </p>
    </div>
  );
}

export default function StoryGalleryModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0
}: StoryGalleryModalProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPostcodeModalOpen, setIsPostcodeModalOpen] = useState(false);

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Close on escape key and handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      // Scroll to the selected image
      setTimeout(() => {
        const element = document.getElementById(`story-${currentIndex}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex]);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleBookNow = () => {
    setIsPostcodeModalOpen(true);
  };

  const handleServiceAvailable = (postcode: string) => {
    setIsPostcodeModalOpen(false);
    onClose();
    router.push(`/booking?postcode=${encodeURIComponent(postcode)}`);
  };

  const handleWaitlist = (postcode: string) => {
    setIsPostcodeModalOpen(false);
    onClose();
    router.push(`/waitlist?postcode=${encodeURIComponent(postcode)}`);
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const isVideo = currentImage?.type === 'video';
  const isEmbedVideo = isVideo && currentImage.src.includes('youtube.com/embed');

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg md:text-xl">From Disgusting to Spotless! 🤢➡️✨</h2>
            <p className="text-white/60 text-sm">
              {images.length} photo{images.length !== 1 ? 's' : ''} • Scroll to view all
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {images.map((image, index) => {
            const isVideo = image?.type === 'video';
            const isEmbedVideo = isVideo && image.src.includes('youtube.com/embed');
            
            return (
              <div
                key={index}
                id={`story-${index}`}
                className="relative rounded-lg overflow-hidden shadow-2xl"
              >
                {/* Media Content */}
                {isVideo ? (
                  isEmbedVideo ? (
                    // Embedded social media video (YouTube, etc.)
                    <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                      <iframe
                        src={image.src}
                        title={image.alt}
                        className="w-full h-full rounded-lg"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    // Direct video file
                    <video
                      src={image.src}
                      poster={image.thumbnail}
                      controls
                      className="w-full h-auto object-contain rounded-lg"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                )}

                {/* Postcode Badge */}
                {image.postcode && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-full flex items-center gap-2 shadow-lg">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium text-sm">{image.postcode}</span>
                    </div>
                  </div>
                )}

                {/* Media Type Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg">
                    {isVideo ? '🎥 Video' : '📸 Photo'} {index + 1}/{images.length}
                  </div>
                </div>

                {/* Caption */}
                {image.caption && (
                  <div className="bg-gray-800 p-4 rounded-b-lg">
                    <p className="text-white text-base md:text-lg font-bold mb-1">
                      {image.caption}
                    </p>
                    <div className="flex items-center gap-4 text-white/70 text-sm">
                      <span>{isVideo ? '🎥 Video' : '📸 Photo'}</span>
                      {image.postcode && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {image.postcode}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Card at Bottom - Sticky with Enhanced Visibility */}
        <div className="sticky bottom-6 left-0 right-0 mt-12 mb-6">
          {/* Gradient fade to draw attention */}
          <div className="absolute -top-12 left-0 right-0 h-12 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
          
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-[2px] rounded-xl shadow-2xl">
            <div className="bg-white rounded-xl px-4 py-6 md:py-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="text-left">
                  <p className="text-gray-900 font-bold text-lg md:text-xl mb-2">
                    🌟 Want results like these? Get your free quote!
                  </p>
                  <p className="text-gray-600 text-sm font-medium">
                    But first, check we serve your area. • No up-front payments - Book now, pay after we clean when you're satisfied • Professional bin cleaning • Same-day service • 100% satisfaction guaranteed
                  </p>
                </div>
                <button
                  onClick={handleBookNow}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-3 md:px-8 md:py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap animate-bounce hover:animate-none"
                >
                  Check Your Postcode
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Postcode Checker Modal */}
      {isPostcodeModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Check Your Postcode</h3>
                  <p className="text-white/90 text-sm mt-1">Let's see if we service your area</p>
                </div>
                <button
                  onClick={() => setIsPostcodeModalOpen(false)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <PostcodeCheckerForm
                onServiceAvailable={handleServiceAvailable}
                onWaitlist={handleWaitlist}
              />
            </div>
          </div>
        </div>
      )}

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
