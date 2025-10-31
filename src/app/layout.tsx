/**
 * ROOT LAYOUT - Global Application Wrapper
 * ========================================
 * 
 * This is the main layout file for the entire Next.js application.
 * Every page in the app is automatically wrapped by this layout.
 * 
 * Key Functions:
 * - Sets up HTML document structure (<html>, <head>, <body>)
 * - Loads and configures global fonts (Geist Sans & Mono)
 * - Defines SEO metadata (title, description for search engines)
 * - Configures mobile viewport settings for responsive design
 * - Sets up global background wallpaper across all pages
 * - Applies consistent styling and mobile optimization
 * 
 * TikTok-inspired design principles:
 * - Mobile-first approach with viewport controls
 * - Clean typography with optimized font loading
 * - Consistent background pattern across all pages
 * - App-like mobile experience (no zoom, fixed viewport)
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Font Configuration
// ===================
// Load Google Fonts with CSS variables for global use
// These fonts are optimized and preloaded for better performance
const geistSans = Geist({
  variable: "--font-geist-sans", // Creates CSS variable: var(--font-geist-sans)
  subsets: ["latin"],           // Only load Latin characters (reduces bundle size)
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", // Creates CSS variable: var(--font-geist-mono)
  subsets: ["latin"],           // Used for code blocks, technical content
});

// SEO Metadata Configuration
// ==========================
// Default metadata for all pages (can be overridden by individual pages)
// This appears in:
// - Browser tab titles
// - Google search results
// - Social media shares (Facebook, Twitter, LinkedIn)
// - Bookmark titles
export const metadata: Metadata = {
  title: "Bin Cleaning Service - Professional Wheelie Bin Cleaning",
  description: "Professional bin cleaning service. Get your wheelie bins, recycling bins, and garden waste bins cleaned professionally. Book online now!",
  
  // Open Graph tags for Facebook, LinkedIn, WhatsApp
  openGraph: {
    title: "Bin Cleaning Service - Professional Wheelie Bin Cleaning",
    description: "Professional bin cleaning service. Get your wheelie bins cleaned professionally. Book online now!",
    url: "https://yourdomain.com", // TODO: Replace with your actual domain
    siteName: "Bin Cleaning Service",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "/social-preview.jpg", // TODO: Create this image (1200x630px)
        width: 1200,
        height: 630,
        alt: "Professional Bin Cleaning Service",
      },
    ],
  },
  
  // Twitter Card tags for X/Twitter
  twitter: {
    card: "summary_large_image",
    title: "Bin Cleaning Service - Professional Wheelie Bin Cleaning",
    description: "Professional bin cleaning service. Book online now!",
    images: ["/social-preview.jpg"], // TODO: Create this image
  },
  
  // Additional metadata
  keywords: ["bin cleaning", "wheelie bin cleaning", "professional cleaning", "bin wash", "bin sanitization"],
  authors: [{ name: "Bin Cleaning Service" }],
  robots: {
    index: true,
    follow: true,
  },
};

// Mobile Viewport Configuration
// =============================
// Creates app-like mobile experience following TikTok design principles
// - Prevents zooming for consistent UI
// - Ensures proper responsive scaling
// - Optimizes for mobile-first design
export const viewport = {
  width: 'device-width',    // Match device width exactly
  initialScale: 1,          // Start at 100% zoom
  maximumScale: 1,          // Prevent zoom-in
  userScalable: false,      // Disable pinch-to-zoom (app-like behavior)
};

// Root Layout Component
// =====================
// This wraps ALL pages in the application
// children = the content of each individual page (home, booking, admin, etc.)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
        // Applies:
        // - geistSans.variable: Makes Geist Sans available as CSS variable
        // - geistMono.variable: Makes Geist Mono available as CSS variable  
        // - antialiased: Smooth font rendering
        // - bg-white: Default white background
        // - text-black: Default black text color
      >
        {/* Global Background Wallpaper Layer */}
        {/* ==================================== */}
        {/* This creates a consistent background pattern across ALL pages */}
        <div 
          className="fixed inset-0 -z-10 bg-repeat opacity-50"
          // fixed inset-0: Covers entire viewport, doesn't scroll
          // -z-10: Behind all content (negative z-index)
          // bg-repeat: Tiles the background image
          // opacity-60: 60% opacity for more visible background pattern
          style={{
            backgroundImage: "url('/wallpaper.jpg')", // Your background image
            backgroundSize: "300px 300px",            // Size of each tile
          }}
        >
          {/* Overlay for Enhanced Readability */}
          {/* Adds subtle white overlay to ensure text is always readable */}
          <div className="absolute inset-0 bg-white/10"></div>
        </div>
        
        {/* Main Content Container */}
        {/* ====================== */}
        {/* All page content is rendered here with proper layering */}
        <div className="relative z-10">
          {/* 
            {children} is replaced with the content of each page:
            - Home page (PostcodeChecker component)
            - Booking page (BookingForm component)  
            - Thank you page (ThankYouPage component)
            - Admin pages, etc.
          */}
          {children}
        </div>
      </body>
    </html>
  );
}
