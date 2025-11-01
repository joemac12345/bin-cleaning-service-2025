/**
 * SEE OUR WORK SECTION COMPONENT
 * 
 * A reusable component featuring:
 * - Story-style image gallery (6 cards, 160x280px)
 * - Horizontal swipe carousel with snap scrolling
 * - Modal gallery integration
 * - Mobile-responsive with scroll indicators
 * 
 * Usage: Pass galleryImages array and openGallery function as props
 */

'use client';

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

interface SeeOurWorkSectionProps {
  /** Array of images for the gallery */
  galleryImages: GalleryImage[];
  /** Function to open gallery modal at specific index */
  onOpenGallery: (index: number) => void;
}

export default function SeeOurWorkSection({ galleryImages, onOpenGallery }: SeeOurWorkSectionProps) {
  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-left">
          Do Your Bins Look Like This? 🤢
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-6 text-left">
          See how disgusting and unhygienic bins get without professional cleaning. We transform the worst bins into sparkling clean, odor-free containers.
        </p>
        
        {/* Story Cards Carousel */}
        <div className="relative -mx-4">
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => onOpenGallery(index)}
                className="flex-none w-[160px] snap-start cursor-pointer"
              >
                <div className="relative h-[280px] bg-gray-100 shadow-2xl overflow-hidden rounded-xl transform translate-y-[-4px]">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-2">
                    <p className="text-xs font-medium leading-tight">
                      {getShortCaption(image.caption)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="flex gap-2 mt-6 px-4">
            <div className="w-2 h-2 bg-[#3B4044]"></div>
            <div className="w-2 h-2 bg-gray-300"></div>
            <div className="w-2 h-2 bg-gray-300"></div>
          </div>
        </div>

        {/* Swipe Hint - Mobile Only */}
        <p className="text-sm text-gray-500 mt-4 md:hidden">
          ← Swipe to see all photos
        </p>
      </div>

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

/**
 * Helper function to create short captions for story cards
 * Extracts key phrases from full captions
 */
function getShortCaption(caption: string): string {
  const shortCaptions: { [key: string]: string } = {
    'Professional deep cleaning for all bin types': 'Disgusting → Spotless',
    'Before and after - spotless results': 'Shocking transformation', 
    'Eco-friendly sanitizers and hot water treatment': 'From filthy to fresh',
    'Serving homes across the UK': 'We fix the worst bins',
    'We handle all types of waste bins': 'No bin too dirty',
    'Same-day collection service available': 'Emergency cleaning'
  };
  
  return shortCaptions[caption] || caption;
}
