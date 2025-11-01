/**
 * COOL DEMO PAGE
 * 
 * A tabbed demonstration page showcasing multiple components
 * in organized tabs for easy navigation and testing.
 * 
 * Design: Clean layout with TikTok-inspired aesthetics
 */

'use client';

import { useState } from 'react';
import { ArrowLeft, MapPin, Type, RotateCcw, Package, Navigation, FileText, Shield, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CompactPostcodeChecker from '@/components/CompactPostcodeChecker';
import InlinePostcodeChecker from '@/components/InlinePostcodeChecker';
import WhatWeOfferSection from '@/components/WhatWeOfferSection';
import TitleSubtitle from '@/components/TitleSubtitle';
import ImageCarousel from '@/components/ImageCarousel';
import VideoCard from '@/components/VideoCard';
import Logo from '@/components/Logo';
import PageHeader from '@/components/PageHeader';
import TopHeader from '@/components/TopHeader';
import TopNavigation from '@/components/TopNavigation';
import BottomNavigation from '@/components/BottomNavigation';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import BookingForm from '@/components/BookingForm';
import AdminNavigation from '@/components/AdminNavigation';

type TabType = 'postcodes' | 'titles' | 'services' | 'carousels' | 'navigation' | 'forms' | 'admin';

export default function CoolDemoPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('postcodes');
  const [results, setResults] = useState<string[]>([]);

  // Demo data for gallery images
  const demoGalleryImages = [
    { src: '/123.png', alt: 'Before cleaning', caption: 'Before - Dirty bin' },
    { src: '/bin123.png', alt: 'After cleaning', caption: 'After - Sparkling clean' },
    { src: '/image Binguy.png', alt: 'Our mascot', caption: 'Meet BinGuy' },
    { src: '/123.png', alt: 'Service in action', caption: 'Professional service' },
    { src: '/bin123.png', alt: 'Happy customer', caption: 'Satisfied customer' },
    { src: '/image Binguy.png', alt: 'Team at work', caption: 'Our expert team' },
  ];

  // Demo data for products
  const demoProducts = [
    {
      id: 1,
      name: 'Standard Bin Cleaning',
      price: 15,
      originalPrice: 20,
      discount: 25,
      image: '/bin123.png',
      rating: 4.8,
      reviews: 124,
      isLive: true,
      seller: 'TheBinGuys',
      badge: 'Popular'
    },
    {
      id: 2,
      name: 'Premium Deep Clean',
      price: 25,
      originalPrice: 35,
      discount: 29,
      image: '/123.png',
      rating: 4.9,
      reviews: 89,
      isLive: false,
      seller: 'TheBinGuys',
      badge: 'Premium'
    },
    {
      id: 3,
      name: 'Monthly Service Plan',
      price: 40,
      originalPrice: 60,
      discount: 33,
      image: '/image Binguy.png',
      rating: 4.7,
      reviews: 203,
      isLive: true,
      seller: 'TheBinGuys',
      badge: 'Best Value'
    }
  ];

  const handleServiceAvailable = (postcode: string) => {
    setResults(prev => [...prev, `✅ Service Available: ${postcode}`]);
    console.log('Service available for:', postcode);
  };

  const handleWaitlist = (postcode: string) => {
    setResults(prev => [...prev, `⏳ Added to Waitlist: ${postcode}`]);
    console.log('Added to waitlist:', postcode);
  };

  const tabs = [
    { id: 'postcodes' as TabType, label: 'Postcode Checkers', icon: MapPin },
    { id: 'titles' as TabType, label: 'Title Components', icon: Type },
    { id: 'services' as TabType, label: 'Service Sections', icon: Package },
    { id: 'carousels' as TabType, label: 'Carousels', icon: RotateCcw },
    { id: 'navigation' as TabType, label: 'Navigation', icon: Navigation },
    { id: 'forms' as TabType, label: 'Forms & Cards', icon: FileText },
    { id: 'admin' as TabType, label: 'Admin Components', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#3B4044] text-white px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">Cool Demo</h1>
            <p className="text-white/80 text-sm md:text-base">
              Component Showcase & Testing
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors
                      ${activeTab === tab.id 
                        ? 'bg-[#3B4044] text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Results Log - Shows for postcode tab */}
            {activeTab === 'postcodes' && results.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Test Results:</h3>
                <div className="space-y-1">
                  {results.map((result, index) => (
                    <div key={index} className="text-sm text-gray-700 font-mono">
                      {result}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setResults([])}
                  className="mt-2 text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear Results
                </button>
              </div>
            )}

            {/* Postcode Checkers Tab */}
            {activeTab === 'postcodes' && (
              <div className="space-y-8">
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Compact Postcode Checker
                    </h2>
                    <p className="text-gray-600">
                      Full-featured version with detailed feedback. Perfect for main sections and hero areas.
                    </p>
                  </div>
                  
                  <div className="max-w-2xl">
                    <CompactPostcodeChecker
                      onServiceAvailable={handleServiceAvailable}
                      onWaitlist={handleWaitlist}
                      placeholder="Enter your postcode (e.g. SW1A 1AA)"
                      buttonText="Check Availability"
                    />
                  </div>

                                    <div className="mt-6 text-sm text-gray-500">
                    <strong>Best for:</strong> Main landing sections, hero areas, dedicated postcode check pages
                  </div>
                </section>

                {/* Inline Versions */}
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Inline Postcode Checker
                    </h2>
                    <p className="text-gray-600">
                      Ultra-compact single-line version. Perfect for navigation bars, footers, or tight spaces.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Large Size */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Large Size</h3>
                      <div className="max-w-xl">
                        <InlinePostcodeChecker
                          onServiceAvailable={handleServiceAvailable}
                          onWaitlist={handleWaitlist}
                          size="lg"
                          theme="light"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Good for hero sections or main call-to-action areas
                      </p>
                    </div>

                    {/* Medium Size */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Medium Size (Default)</h3>
                      <div className="max-w-lg">
                        <InlinePostcodeChecker
                          onServiceAvailable={handleServiceAvailable}
                          onWaitlist={handleWaitlist}
                          size="md"
                          theme="light"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Perfect for content sections and sidebar widgets
                      </p>
                    </div>

                    {/* Small Size */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Small Size</h3>
                      <div className="max-w-sm">
                        <InlinePostcodeChecker
                          onServiceAvailable={handleServiceAvailable}
                          onWaitlist={handleWaitlist}
                          size="sm"
                          theme="light"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Great for navigation bars, footers, or mobile layouts
                      </p>
                    </div>
                  </div>
                </section>

                {/* Dark Theme Example */}
                <section className="bg-gray-900 rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Dark Theme Version
                    </h2>
                    <p className="text-gray-300">
                      For dark sections or themes. All sizes available in dark mode.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="max-w-lg">
                      <InlinePostcodeChecker
                        onServiceAvailable={handleServiceAvailable}
                        onWaitlist={handleWaitlist}
                        size="md"
                        theme="dark"
                      />
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-gray-400">
                    <strong>Best for:</strong> Dark hero sections, footer areas, or dark-themed pages
                  </div>
                </section>

                {/* Usage Examples */}
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Usage Examples
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">In a Hero Section:</h3>
                      <code className="text-sm text-gray-700 block">
                        {`<CompactPostcodeChecker 
  onServiceAvailable={handleService}
  onWaitlist={handleWaitlist}
  placeholder="Enter your postcode..."
  buttonText="Get Started"
/>`}
                      </code>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">In Navigation Bar:</h3>
                      <code className="text-sm text-gray-700 block">
                        {`<InlinePostcodeChecker 
  onServiceAvailable={handleService}
  onWaitlist={handleWaitlist}
  size="sm"
  theme="light"
/>`}
                      </code>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">In Footer (Dark):</h3>
                      <code className="text-sm text-gray-700 block">
                        {`<InlinePostcodeChecker 
  onServiceAvailable={handleService}
  onWaitlist={handleWaitlist}
  size="md"
  theme="dark"
/>`}
                      </code>
                    </div>
                  </div>
                </section>

                {/* Inline Versions */}
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Inline Postcode Checker
                    </h2>
                    <p className="text-gray-600">
                      Ultra-compact single-line version. Perfect for navigation bars, footers, or tight spaces.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Large Size */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Large Size</h3>
                      <div className="max-w-xl">
                        <InlinePostcodeChecker
                          onServiceAvailable={handleServiceAvailable}
                          onWaitlist={handleWaitlist}
                          size="lg"
                          theme="light"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Good for hero sections or main call-to-action areas
                      </p>
                    </div>

                    {/* Medium Size */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Medium Size (Default)</h3>
                      <div className="max-w-lg">
                        <InlinePostcodeChecker
                          onServiceAvailable={handleServiceAvailable}
                          onWaitlist={handleWaitlist}
                          size="md"
                          theme="light"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Perfect for content sections and sidebar widgets
                      </p>
                    </div>

                    {/* Small Size */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Small Size</h3>
                      <div className="max-w-sm">
                        <InlinePostcodeChecker
                          onServiceAvailable={handleServiceAvailable}
                          onWaitlist={handleWaitlist}
                          size="sm"
                          theme="light"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Great for navigation bars, footers, or mobile layouts
                      </p>
                    </div>
                  </div>
                </section>

                {/* Dark Theme Example */}
                <section className="bg-gray-900 rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Dark Theme Version
                    </h2>
                    <p className="text-gray-300">
                      For dark sections or themes. All sizes available in dark mode.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="max-w-lg">
                      <InlinePostcodeChecker
                        onServiceAvailable={handleServiceAvailable}
                        onWaitlist={handleWaitlist}
                        size="md"
                        theme="dark"
                      />
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-gray-400">
                    <strong>Best for:</strong> Dark hero sections, footer areas, or dark-themed pages
                  </div>
                </section>

                {/* Usage Examples */}
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Usage Examples
                  </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">In a Hero Section:</h3>
                <code className="text-sm text-gray-700 block">
                  {`<CompactPostcodeChecker 
  onServiceAvailable={handleService}
  onWaitlist={handleWaitlist}
  placeholder="Enter your postcode..."
  buttonText="Get Started"
/>`}
                </code>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">In Navigation Bar:</h3>
                <code className="text-sm text-gray-700 block">
                  {`<InlinePostcodeChecker 
  onServiceAvailable={handleService}
  onWaitlist={handleWaitlist}
  size="sm"
  theme="light"
/>`}
                </code>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">In Footer (Dark):</h3>
                <code className="text-sm text-gray-700 block">
                  {`<InlinePostcodeChecker 
  onServiceAvailable={handleService}
  onWaitlist={handleWaitlist}
  size="md"
  theme="dark"
/>`}
                </code>
              </div>
            </div>
          </section>

          {/* Title & Subtitle Component Demo */}
          <section className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Title & Subtitle Component
              </h2>
              <p className="text-gray-600">
                Flexible typography component with multiple sizes, alignments, and themes.
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Title Examples */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Simple Title Examples</h3>
                <div className="space-y-6">
                  <TitleSubtitle header="Welcome to Our Service" />
                  <TitleSubtitle header="Professional Bin Cleaning" />
                  <TitleSubtitle header="Clean & Reliable Service" />
                  <TitleSubtitle header="Your Local Cleaning Experts" />
                </div>
              </div>

              {/* Alignment Options */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Text Alignment</h3>
                <div className="space-y-4">
                  <TitleSubtitle header="Left Aligned Title" />
                  <TitleSubtitle header="Center Aligned Title" className="text-center" />
                  <TitleSubtitle header="Right Aligned Title" className="text-right" />
                </div>
              </div>

              {/* Title Only */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Title Only (No Subtitle)</h3>
                <TitleSubtitle 
                  header="Standalone Title"
                  className="text-center"
                />
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <strong>Best for:</strong> Page headers, section titles, hero headings, feature titles
            </div>
          </section>

              </div>
            )}

            {/* Title Components Tab */}
            {activeTab === 'titles' && (
              <div className="space-y-8">
                <TitleSubtitle 
                  header="" 
                  postedBy=""
                />
              </div>
            )}

            {/* Service Sections Tab */}
            {activeTab === 'services' && (
              <div className="space-y-8">
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      What We Offer Section
                    </h2>
                    <p className="text-gray-600">
                      Service description component with mascot and bullet points.
                    </p>
                  </div>
                  
                  <WhatWeOfferSection />

                  <div className="mt-6 text-sm text-gray-500">
                    <strong>Best for:</strong> Service description sections, about pages, feature highlights
                  </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Product Grid
                    </h2>
                    <p className="text-gray-600">
                      Grid layout for displaying services, products, or features.
                    </p>
                  </div>
                  
                  <ProductGrid products={demoProducts} />

                  <div className="mt-6 text-sm text-gray-500">
                    <strong>Best for:</strong> Service listings, product catalogs, feature grids
                  </div>
                </section>
              </div>
            )}

            {/* Carousels Tab */}
            {activeTab === 'carousels' && (
              <div className="space-y-8">
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Image Carousel
                    </h2>
                    <p className="text-gray-600">
                      Universal carousel component for displaying images with navigation controls.
                    </p>
                  </div>
                  
                  <div className="max-w-4xl mx-auto">
                    <ImageCarousel images={demoGalleryImages} />
                  </div>

                  <div className="mt-6 text-sm text-gray-500">
                    <strong>Best for:</strong> Photo galleries, product showcases, hero banners, before/after images
                  </div>
                </section>
              </div>
            )}

            {/* Navigation Tab */}
            {activeTab === 'navigation' && (
              <div className="space-y-8">
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Logo Component
                    </h2>
                    <p className="text-gray-600">
                      Brand logo in different sizes and variations.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Large Logo</h3>
                      <Logo size="large" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-3">Medium Logo (Default)</h3>
                      <Logo />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-3">Small Logo</h3>
                      <Logo size="small" />
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-gray-500">
                    <strong>Best for:</strong> Headers, footers, branding elements
                  </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Page Header
                    </h2>
                    <p className="text-gray-600">
                      Page header with title and optional subtitle or breadcrumbs.
                    </p>
                  </div>
                  
                  <PageHeader 
                    icon={Package}
                    title="Demo Page"
                    subtitle="Showcasing all components"
                  />

                  <div className="mt-6 text-sm text-gray-500">
                    <strong>Best for:</strong> Page titles, section headers, breadcrumb navigation
                  </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Top Header
                    </h2>
                    <p className="text-gray-600">
                      Main site header with navigation and branding.
                    </p>
                  </div>
                  
                  <TopHeader />

                  <div className="mt-6 text-sm text-gray-500">
                    <strong>Best for:</strong> Main site navigation, sticky headers
                  </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Top Navigation
                    </h2>
                    <p className="text-gray-600">
                      Navigation bar component with menu items.
                    </p>
                  </div>
                  
                  <TopNavigation />

                  <div className="mt-6 text-sm text-gray-500">
                    <strong>Best for:</strong> Main navigation, menu bars
                  </div>
                </section>

                <section className="bg-gray-900 rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Bottom Navigation
                    </h2>
                    <p className="text-gray-300">
                      Mobile-style bottom navigation bar.
                    </p>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <BottomNavigation />
                  </div>

                  <div className="mt-6 text-sm text-gray-400">
                    <strong>Best for:</strong> Mobile navigation, app-style interfaces
                  </div>
                </section>
              </div>
            )}

            {/* Forms & Cards Tab */}
            {activeTab === 'forms' && (
              <div className="space-y-8">
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Booking Form
                    </h2>
                    <p className="text-gray-600">
                      Complete booking form with validation and styling.
                    </p>
                  </div>
                  
                  <div className="max-w-2xl">
                    <BookingForm 
                      postcode="SW1A 1AA"
                      onBack={() => console.log('Back to postcode checker')}
                    />
                  </div>

                  <div className="mt-6 text-sm text-gray-500">
                    <strong>Best for:</strong> Service bookings, contact forms, lead generation
                  </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Category Filter
                    </h2>
                    <p className="text-gray-600">
                      Filter component for categorizing content or products.
                    </p>
                  </div>
                  
                  <CategoryFilter 
                    categories={['All Services', 'Standard Clean', 'Deep Clean', 'Monthly Plan']}
                    selectedCategory="All Services"
                    onCategoryChange={(category) => console.log('Selected:', category)}
                  />

                  <div className="mt-6 text-sm text-gray-500">
                    <strong>Best for:</strong> Product filtering, content categorization, navigation tabs
                  </div>
                </section>
              </div>
            )}

            {/* Admin Components Tab */}
            {activeTab === 'admin' && (
              <div className="space-y-8">
                <section className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Admin Navigation
                    </h2>
                    <p className="text-gray-600">
                      Full-screen admin navigation overlay with sections for managing bookings, photos, and service areas.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Click the menu button below to see the admin navigation in action:
                    </p>
                    <AdminNavigation />
                    <div className="mt-4 text-xs text-gray-500">
                      <strong>Note:</strong> This component creates a full-screen overlay when opened. Try clicking the menu button above!
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-gray-500">
                    <strong>Best for:</strong> Admin dashboards, management interfaces, mobile-friendly navigation overlays
                  </div>

                  <div className="mt-4 bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Admin Navigation Features:</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Full-screen overlay with smooth animations</li>
                      <li>• Mobile-optimized hamburger menu</li>
                      <li>• Active state highlighting for current page</li>
                      <li>• Icons and descriptions for each section</li>
                      <li>• Special styling for "Back to Home" option</li>
                      <li>• Dark mode support</li>
                      <li>• Accessible with keyboard navigation</li>
                    </ul>
                  </div>

                  <div className="mt-4 bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-900 mb-2">Navigation Sections:</h3>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• <strong>Dashboard:</strong> Overview and key metrics</li>
                      <li>• <strong>Bookings:</strong> Manage customer bookings</li>
                      <li>• <strong>Photo Gallery:</strong> Upload and manage work photos</li>
                      <li>• <strong>Abandoned Forms:</strong> Follow up with incomplete bookings</li>
                      <li>• <strong>Postcode Manager:</strong> Manage service areas and demand</li>
                      <li>• <strong>Back to Home:</strong> Return to main website</li>
                    </ul>
                  </div>
                </section>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 text-sm">
            Demo Page • Component testing and presentation
          </p>
        </div>
      </div>
    </div>
  );
}
