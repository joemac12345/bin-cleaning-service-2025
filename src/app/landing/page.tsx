/**
 * LANDING PAGE - Bin Cleaning Service
 * 
 * A comprehensive marketing landing page featuring:
 * - Hero section with CTA
 * - Image gallery with modal viewer (6 story-style cards)  
 * - Why Choose Us carousel (3 features)
 * - How It Works carousel (4 steps)
 * - Pricing grid (4 bin types)
 * - Service areas and footer
 * 
 * Design: TikTok-inspired with carousels, #3B4044 brand color
 * Mobile-first responsive design with swipe functionality
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Sparkles, Clock, MapPin, CheckCircle, Phone, Mail, ArrowRight } from 'lucide-react';
import TopNavigation from '@/components/TopNavigation';
import ImageCarousel from '@/components/ImageCarousel';
import ImageGalleryModal from '@/components/ImageGalleryModal';
import { SeeOurWorkSection } from '@/components/Stories';
import ServicesCarousel from '@/components/ServicesCarousel';
import SocialMediaCarousel from '@/components/SocialMediaCarousel';

export default function LandingPage() {
  const router = useRouter();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // No fallback images - use empty array to show proper empty state
  const [modalImages, setModalImages] = useState<any[]>([]); // Start with empty array

  const openGallery = (index: number) => {
    console.log('🎬 Opening gallery at index:', index);
    console.log('📷 Current modalImages:', modalImages);
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  };

  // Callback to receive photos from SeeOurWorkSection
  const handlePhotosLoaded = (photos: any[]) => {
    console.log('📸 Landing page received photos for modal:', photos);
    console.log('📊 Photos count:', photos.length);
    if (photos.length > 0) {
      console.log('✅ Using database photos for modal');
      setModalImages(photos);
    } else {
      console.log('⚠️ No database photos, modal will remain empty');
      setModalImages([]);
    }
  };

  // Safety check - log if no photos after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (modalImages.length === 0) {
        console.log('⏰ Timeout: No photos received from database - showing empty state');
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <TopNavigation />
      
      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={modalImages}
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
          <div className="relative px-4 py-12 max-w-5xl mx-auto">
            <div className="text-left max-w-2xl">
              {/* Icon */}
              <div className="w-16 h-16 bg-white mb-4 flex items-center justify-center rounded-lg">
                <Sparkles className="w-10 h-10 text-[#3B4044]" strokeWidth={2.5} />
              </div>
              
              {/* Headline */}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-md">
                Welcome to TheBinGuy
              </h1>
              <p className="text-xl md:text-2xl text-white/95 mb-4 drop-shadow-sm font-medium">
                Your Local Bin Cleaning Experts
              </p>
              <p className="text-base md:text-lg text-white/85 mb-6 drop-shadow-sm leading-relaxed">
                We make your wheelie bins spotless, fresh, and hygienic! Professional cleaning service for homes and businesses across the UK. Say goodbye to smelly, dirty bins forever.
              </p>
              
              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push('/')}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#3B4044] font-bold text-base px-6 py-3 rounded-lg transition-colors shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Book Bin Cleaning
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Services Carousel */}
        <ServicesCarousel />

        {/* CTA Section */}
        <div className="px-4 py-16 max-w-6xl mx-auto">
          <div className="bg-[#3B4044] p-8 md:p-12 text-left relative overflow-hidden">
            {/* Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: 'url(/wallpaper.jpg)' }}
            />
            
            {/* Content */}
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Before You Keep Scrolling... 📍
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl">
                We don't want to disappoint you! Please check your service area first - we don't service the whole UK yet. Make sure we're available in your postcode before getting excited about our services.
              </p>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#3B4044] font-bold text-lg px-8 py-4 transition-colors shadow-lg rounded-lg"
              >
                <MapPin className="w-5 h-5" />
                Check Your Postcode
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-white/70 mt-4">
                Enter your postcode to see available services and pricing in your area
              </p>
            </div>
          </div>
        </div>

        {/* See Our Work Section - Loads photos from database */}
        <SeeOurWorkSection 
          onOpenGallery={openGallery}
          onPhotosLoaded={handlePhotosLoaded}
        />

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
            </div>
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
            </div>

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

        {/* Social Media Carousel */}
        <SocialMediaCarousel />

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
