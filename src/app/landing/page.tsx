'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Sparkles, Clock, MapPin, CheckCircle, Phone, Mail, ArrowRight } from 'lucide-react';
import TopNavigation from '@/components/TopNavigation';
import ImageCarousel from '@/components/ImageCarousel';
import ImageGalleryModal from '@/components/ImageGalleryModal';

export default function LandingPage() {
  const router = useRouter();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const galleryImages = [
    {
      src: '/wallpaper.jpg',
      alt: 'Professional bin cleaning service in action',
      caption: 'Professional deep cleaning for all bin types'
    },
    {
      src: '/bin123.png',
      alt: 'Clean and sanitized wheelie bin',
      caption: 'Before and after - spotless results'
    },
    {
      src: '/123.png',
      alt: 'Eco-friendly cleaning process',
      caption: 'Eco-friendly sanitizers and hot water treatment'
    },
    {
      src: '/wallpaper.jpg',
      alt: 'Residential bin cleaning service',
      caption: 'Serving homes across the UK'
    },
    {
      src: '/bin123.png',
      alt: 'Multiple bin cleaning',
      caption: 'We handle all types of waste bins'
    },
    {
      src: '/123.png',
      alt: 'Fast and efficient service',
      caption: 'Same-day collection service available'
    }
  ];

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <>
      <TopNavigation />
      
      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={galleryImages}
        initialIndex={selectedImageIndex}
      />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-[#3B4044] overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: 'url(/wallpaper.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
          
          {/* Content */}
          <div className="relative px-4 py-16 max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              {/* Icon */}
              <div className="w-20 h-20 bg-white mx-auto mb-6 flex items-center justify-center">
                <Trash2 className="w-12 h-12 text-[#3B4044]" strokeWidth={2.5} />
              </div>
              
              {/* Headline */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
                Professional Bin Cleaning Service
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-sm">
                Keep your bins fresh, clean, and odor-free with our eco-friendly cleaning service
              </p>
              
              {/* CTA Button */}
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#3B4044] font-bold text-lg px-8 py-4 transition-colors shadow-lg"
              >
                Check Your Postcode
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Image Carousel Section */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              See Our Work
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              Check out real results from our professional bin cleaning service
            </p>
            
            {/* Horizontal Swipe Carousel */}
            <div className="relative -mx-4">
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4">
                {/* Story Card 1 */}
                <button
                  onClick={() => openGallery(0)}
                  className="flex-none w-[160px] snap-start cursor-pointer"
                >
                  <div className="relative h-[280px] bg-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img
                      src="/wallpaper.jpg"
                      alt="Professional bin cleaning service in action"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-2">
                      <p className="text-xs font-medium leading-tight">Professional deep cleaning</p>
                    </div>
                  </div>
                </button>

                {/* Story Card 2 */}
                <button
                  onClick={() => openGallery(1)}
                  className="flex-none w-[160px] snap-start cursor-pointer"
                >
                  <div className="relative h-[280px] bg-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img
                      src="/bin123.png"
                      alt="Clean and sanitized wheelie bin"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-2">
                      <p className="text-xs font-medium leading-tight">Before and after results</p>
                    </div>
                  </div>
                </button>

                {/* Story Card 3 */}
                <button
                  onClick={() => openGallery(2)}
                  className="flex-none w-[160px] snap-start cursor-pointer"
                >
                  <div className="relative h-[280px] bg-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img
                      src="/123.png"
                      alt="Eco-friendly cleaning process"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-2">
                      <p className="text-xs font-medium leading-tight">Eco-friendly treatment</p>
                    </div>
                  </div>
                </button>

                {/* Story Card 4 */}
                <button
                  onClick={() => openGallery(3)}
                  className="flex-none w-[160px] snap-start cursor-pointer"
                >
                  <div className="relative h-[280px] bg-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img
                      src="/wallpaper.jpg"
                      alt="Residential bin cleaning service"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-2">
                      <p className="text-xs font-medium leading-tight">Residential service</p>
                    </div>
                  </div>
                </button>

                {/* Story Card 5 */}
                <button
                  onClick={() => openGallery(4)}
                  className="flex-none w-[160px] snap-start cursor-pointer"
                >
                  <div className="relative h-[280px] bg-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img
                      src="/bin123.png"
                      alt="Multiple bin cleaning"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-2">
                      <p className="text-xs font-medium leading-tight">All bin types</p>
                    </div>
                  </div>
                </button>

                {/* Story Card 6 */}
                <button
                  onClick={() => openGallery(5)}
                  className="flex-none w-[160px] snap-start cursor-pointer"
                >
                  <div className="relative h-[280px] bg-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img
                      src="/123.png"
                      alt="Fast and efficient service"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-2">
                      <p className="text-xs font-medium leading-tight">Same-day service</p>
                    </div>
                  </div>
                </button>
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
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Features Section - Carousel */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Why Choose Us?
            </h2>
            
            {/* Carousel Container */}
            <div className="relative -mx-4">
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4">
                {/* Feature 1 */}
                <div className="flex-none w-[80vw] sm:w-[280px] md:w-[260px] snap-start">
                  <div className="bg-gray-100 p-4 shadow-md h-full">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 flex-shrink-0 bg-[#3B4044] flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 pt-2">
                        Deep Clean & Sanitize
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Professional hot water cleaning with eco-friendly sanitizers that eliminate bacteria, odors, and grime.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex-none w-[80vw] sm:w-[280px] md:w-[260px] snap-start">
                  <div className="bg-gray-100 p-4 shadow-md h-full">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 flex-shrink-0 bg-[#3B4044] flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 pt-2">
                        Fast & Convenient
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      We clean your bins on the same day they're collected. No mess, no hassle, no effort required from you.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex-none w-[80vw] sm:w-[280px] md:w-[260px] snap-start">
                  <div className="bg-gray-100 p-4 shadow-md h-full">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 flex-shrink-0 bg-[#3B4044] flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 pt-2">
                        Affordable Pricing
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      From just £5 per bin. Regular service available with no contracts or hidden fees.
                    </p>
                  </div>
                </div>
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
              ← Swipe to see all features
            </p>
          </div>
        </div>

        {/* How It Works Section - Carousel */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              How It Works
            </h2>
            
            {/* Carousel Container */}
            <div className="relative -mx-4">
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4">
                {/* Step 1 */}
                <div className="flex-none w-[80vw] sm:w-[240px] md:w-[200px] snap-start">
                  <div className="bg-white p-3 shadow-md h-full flex items-start gap-2.5">
                    <div className="w-8 h-8 flex-shrink-0 bg-[#3B4044] text-white flex items-center justify-center text-base font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-0.5">Check Availability</h3>
                      <p className="text-xs text-gray-600 leading-snug">
                        Enter your postcode to see if we service your area
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex-none w-[80vw] sm:w-[240px] md:w-[200px] snap-start">
                  <div className="bg-white p-3 shadow-md h-full flex items-start gap-2.5">
                    <div className="w-8 h-8 flex-shrink-0 bg-[#3B4044] text-white flex items-center justify-center text-base font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-0.5">Book Online</h3>
                      <p className="text-xs text-gray-600 leading-snug">
                        Choose your bins and schedule your cleaning service
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex-none w-[80vw] sm:w-[240px] md:w-[200px] snap-start">
                  <div className="bg-white p-3 shadow-md h-full flex items-start gap-2.5">
                    <div className="w-8 h-8 flex-shrink-0 bg-[#3B4044] text-white flex items-center justify-center text-base font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-0.5">We Clean</h3>
                      <p className="text-xs text-gray-600 leading-snug">
                        We clean your bins on collection day while you relax
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex-none w-[80vw] sm:w-[240px] md:w-[200px] snap-start">
                  <div className="bg-white p-3 shadow-md h-full flex items-start gap-2.5">
                    <div className="w-8 h-8 flex-shrink-0 bg-[#3B4044] text-white flex items-center justify-center text-base font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-0.5">Fresh Bins</h3>
                      <p className="text-xs text-gray-600 leading-snug">
                        Enjoy clean, sanitized, and odor-free bins
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll Indicator */}
              <div className="flex gap-2 mt-6 px-4">
                <div className="w-2 h-2 bg-[#3B4044]"></div>
                <div className="w-2 h-2 bg-gray-300"></div>
                <div className="w-2 h-2 bg-gray-300"></div>
                <div className="w-2 h-2 bg-gray-300"></div>
              </div>
            </div>

            {/* Swipe Hint - Mobile Only */}
            <p className="text-sm text-gray-500 mt-4 md:hidden">
              ← Swipe to see all steps
            </p>
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Pricing Section */}
        <div className="px-4 py-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Simple, Transparent Pricing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Wheelie Bin */}
            <div className="bg-gray-100 p-6 text-center shadow-md">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Wheelie Bin</h3>
              <p className="text-3xl font-bold text-[#3B4044] mb-2">£5</p>
              <p className="text-sm text-gray-600">per clean</p>
            </div>

            {/* Food Waste */}
            <div className="bg-gray-100 p-6 text-center shadow-md">
              <div className="text-4xl mb-3">🍎</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Food Waste</h3>
              <p className="text-3xl font-bold text-[#3B4044] mb-2">£3</p>
              <p className="text-sm text-gray-600">per clean</p>
            </div>

            {/* Recycling */}
            <div className="bg-gray-100 p-6 text-center shadow-md">
              <div className="text-4xl mb-3">♻️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Recycling Bin</h3>
              <p className="text-3xl font-bold text-[#3B4044] mb-2">£4</p>
              <p className="text-sm text-gray-600">per clean</p>
            </div>

            {/* Garden Waste */}
            <div className="bg-gray-100 p-6 text-center shadow-md">
              <div className="text-4xl mb-3">🌿</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Garden Waste</h3>
              <p className="text-3xl font-bold text-[#3B4044] mb-2">£6</p>
              <p className="text-sm text-gray-600">per clean</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Regular service available with no contracts</p>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 bg-[#3B4044] hover:bg-[#2a2d30] text-white font-bold text-lg px-8 py-4 transition-colors"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Service Areas */}
        <div className="bg-gray-50 px-4 py-16">
          <div className="max-w-6xl mx-auto text-center">
            <MapPin className="w-12 h-12 text-[#3B4044] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Serving Local Communities
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              We're expanding across the UK. Enter your postcode to check if we service your area or join our waitlist.
            </p>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 bg-[#3B4044] hover:bg-[#2a2d30] text-white font-semibold px-6 py-3 transition-colors"
            >
              Check Your Postcode
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-4 py-16 max-w-6xl mx-auto">
          <div className="bg-[#3B4044] p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: 'url(/wallpaper.jpg)' }}
            />
            
            {/* Content */}
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready for Cleaner Bins?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers enjoying fresh, clean bins every week
              </p>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#3B4044] font-bold text-lg px-8 py-4 transition-colors shadow-lg"
              >
                Book Your First Clean
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 text-white px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Company Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-[#3B4044]" />
                  </div>
                  <h3 className="text-xl font-bold">Bin Cleaning Service</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Professional bin cleaning services for homes and businesses across the UK.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <button onClick={() => router.push('/')} className="hover:text-white transition-colors">
                      Check Postcode
                    </button>
                  </li>
                  <li>
                    <button onClick={() => router.push('/booking')} className="hover:text-white transition-colors">
                      Book Now
                    </button>
                  </li>
                  <li>
                    <button onClick={() => router.push('/admin/bookings')} className="hover:text-white transition-colors">
                      Admin
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-bold mb-4">Contact Us</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    0800 123 4567
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    info@binclean.co.uk
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2025 Bin Cleaning Service. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
