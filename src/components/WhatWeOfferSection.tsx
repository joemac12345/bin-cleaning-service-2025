/**
 * WHAT WE OFFER SECTION COMPONENT
 * 
 * A dedicated section showcasing our services with:
 * - Mascot image on the left
 * - Service description and bullet points on the right
 * - Responsive grid layout
 * - Brand-consistent styling
 * 
 * Design: Clean, professional layout with TikTok-inspired aesthetics
 */

'use client';

export default function WhatWeOfferSection() {
  return (
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
  );
}
