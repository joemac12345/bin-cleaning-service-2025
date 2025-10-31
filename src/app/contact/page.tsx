'use client';

import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import TopNavigation from '@/components/TopNavigation';

export default function ContactPage() {
  return (
    <>
      <TopNavigation />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about our bin cleaning service? We're here to help!
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Phone Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-7 h-7 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-600 mb-3">Give us a call for immediate assistance</p>
                  <a 
                    href="tel:+447123456789" 
                    className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    07123 456789
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-7 h-7 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600 mb-3">Send us an email anytime</p>
                  <a 
                    href="mailto:info@bincleaningservice.com" 
                    className="text-xl font-bold text-green-600 hover:text-green-700 transition-colors break-all"
                  >
                    info@bincleaningservice.com
                  </a>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Area</h3>
                  <p className="text-gray-600 mb-3">We serve customers across</p>
                  <p className="text-xl font-bold text-purple-600">
                    Manchester & Surrounding Areas
                  </p>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-7 h-7 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Hours</h3>
                  <p className="text-gray-600 mb-3">We're available:</p>
                  <div className="space-y-1">
                    <p className="text-gray-800 font-medium">Monday - Friday: 8am - 6pm</p>
                    <p className="text-gray-800 font-medium">Saturday: 9am - 4pm</p>
                    <p className="text-gray-800 font-medium">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Follow Us</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Stay connected with us on social media for updates and tips
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-8 h-8 text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-8 h-8 text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-8 h-8 text-white" />
              </a>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Book?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get your bins cleaned today!
            </p>
            <a
              href="/booking"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl text-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Book Now
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
