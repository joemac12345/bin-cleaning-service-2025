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
import CompactPostcodeChecker from '@/components/CompactPostcodeChecker';
import InlinePostcodeChecker from '@/components/InlinePostcodeChecker';

export default function LandingPage() {
  const router = useRouter();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // No fallback images - use empty array to show proper empty state
  const [modalImages, setModalImages] = useState<any[]>([]); // Start with empty array

  // Postcode checker handlers
  const handleServiceAvailable = (postcode: string) => {
    router.push(`/booking?postcode=${encodeURIComponent(postcode)}`);
  };

  const handleWaitlist = (postcode: string) => {
    router.push(`/waitlist?postcode=${encodeURIComponent(postcode)}`);
  };

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
          <div className="relative px-4 py-12 max-w-6xl mx-auto">
            {/* Mascot Image - Top of Hero */}
            <div className="w-30 h-30 mb-4 mt-8 relative z-50">
              <img 
                src="/image1234.png" 
                alt="TheBinGuy Mascot" 
                className="w-50 h-50 object-contain relative "
              />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-8 lg:mt-12">
              <div className="text-left px-2 sm:px-0">
              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 lg:mb-4 drop-shadow-md leading-tight">
                👋 Welcome
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/85 mb-4 lg:mb-6 drop-shadow-sm leading-relaxed max-w-lg">
                Before you say goodbye to dirty bins. Please check we serve your area by using the postcode checker below.👇 
              </p>
              
              {/* Quick Postcode Check */}
              <div className="mt-4 lg:mt-6">
                
                <div className="max-w-sm sm:max-w-md bg-white rounded-xl p-3 sm:p-4 shadow-lg">
                  <InlinePostcodeChecker
                    onServiceAvailable={handleServiceAvailable}
                    onWaitlist={handleWaitlist}
                    size="md"
                    theme="light"
                  />
                </div>
                <p className="text-white/75 text-xs sm:text-sm mt-2 lg:mt-3 max-w-sm">
                  ⚡ Instant booking if available • 📝 Join waitlist if not yet serviced
                </p>
              </div>
              </div>
              
              {/* Optional: Add an image or illustration on the right side */}
              <div className="lg:flex justify-center items-center hidden">
                <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center">
                  <Trash2 className="w-32 h-32 text-white/30" strokeWidth={1} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Carousel */}
        <ServicesCarousel />

        {/* What We Offer Section */}
        <div className="px-4 py-16 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Mascot Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-48 h-48 md:w-64 md:h-64">
                <img 
                  src="/image1234.png" 
                  alt="TheBinGuy Mascot" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Service Description */}
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What We Offer
              </h2>
              <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                Professional cleaning services for your home and business
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3B4044] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Complete wheelie bin cleaning and sanitization</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3B4044] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Food waste and recycling bin services</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3B4044] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Eco-friendly cleaning products and methods</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3B4044] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Reliable scheduled service at your convenience</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3B4044] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Affordable rates with no hidden fees or contracts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Inline Check */}
        <div className="px-4 py-8 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm mb-4">
              💡 <strong>Quick Tip:</strong> Check if we service your area before reading more
            </p>
            <div className="max-w-md mx-auto">
              <InlinePostcodeChecker
                onServiceAvailable={handleServiceAvailable}
                onWaitlist={handleWaitlist}
                size="sm"
                theme="light"
              />
            </div>
          </div>
        </div>

        {/* Service Area Check Section */}
        <div className="px-4 py-16 max-w-6xl mx-auto">
          <div className="bg-[#3B4044] p-8 md:p-12 text-left relative overflow-hidden rounded-xl">
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
              {/* Integrated Postcode Checker */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Check Your Service Area
                </h3>
                <div className="bg-white rounded-lg p-4">
                  <CompactPostcodeChecker
                    onServiceAvailable={handleServiceAvailable}
                    onWaitlist={handleWaitlist}
                    placeholder="Enter your postcode (e.g. SW1A 1AA)"
                    buttonText="Check Availability"
                  />
                </div>
                <p className="text-sm text-white/80 mt-3">
                  ✅ Available areas get instant booking • ⏳ Not available? Join our waitlist
                </p>
              </div>
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

            {/* Quick Postcode Check - Footer */}
            <div className="border-t border-gray-800 pt-8 pb-8">
              <div className="max-w-md mx-auto">
                <h4 className="text-white font-bold mb-3 text-center">Quick Service Check</h4>
                <InlinePostcodeChecker
                  onServiceAvailable={handleServiceAvailable}
                  onWaitlist={handleWaitlist}
                  size="sm"
                  theme="dark"
                />
                <p className="text-gray-400 text-xs text-center mt-2">
                  Enter your postcode to check availability
                </p>
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
