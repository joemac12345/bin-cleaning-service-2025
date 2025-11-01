'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowRight } from 'lucide-react';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: {
    src: string;
    alt: string;
    caption?: string;
    type?: 'image' | 'video';
    thumbnail?: string;
    platform?: string;
    videoId?: string;
  }[];
  initialIndex?: number;
}

export default function ImageGalleryModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0
}: ImageGalleryModalProps) {
  const router = useRouter();

  // Debug logging
  console.log('🖼️ ImageGalleryModal render:', {
    isOpen,
    imagesCount: images.length,
    initialIndex,
    images: images
  });

  // Close on escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Scroll to the selected image
      setTimeout(() => {
        const element = document.getElementById(`gallery-image-${initialIndex}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, initialIndex]);

  const handleBookNow = () => {
    onClose();
    router.push('/');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Our Work Gallery</h2>
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white p-2 transition-colors"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Scrollable Image Container */}
      <div className="overflow-y-auto h-[calc(100vh-73px)] pb-32">
        <div className="max-w-4xl mx-auto px-4 space-y-6 pt-6">
          {images.map((image, index) => {
            const isVideo = image.type === 'video';
            const isEmbedVideo = isVideo && image.src.includes('youtube.com/embed');
            
            return (
              <div
                key={index}
                id={`gallery-image-${index}`}
                className="bg-gray-900 shadow-2xl overflow-hidden relative"
              >
                {isVideo ? (
                  isEmbedVideo ? (
                    // Embedded social media video
                    <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                      <iframe
                        src={image.src}
                        title={image.alt}
                        className="w-full h-full"
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
                      className="w-full h-auto object-contain max-h-[80vh]"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto object-contain max-h-[80vh]"
                  />
                )}

                {image.caption && (
                  <div className="bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white text-base md:text-lg font-medium">
                      {image.caption}
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                      {isVideo ? 'Video' : 'Image'} {index + 1} of {images.length}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed CTA Card at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-11">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl border-2 border-[#3B4044] px-4 py-4 md:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-left">
            <p className="text-[#3B4044] font-bold text-base md:text-lg">
              Get a free estimate now for your bin cleaning
            </p>
            <p className="text-gray-600 text-sm">
              Professional service • Eco-friendly • Fast turnaround
            </p>
          </div>
          <button
            onClick={handleBookNow}
            className="bg-[#3B4044] hover:bg-[#2a2d30] text-white font-bold px-6 py-3 md:px-8 md:py-4 shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            Check Your Postcode
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
