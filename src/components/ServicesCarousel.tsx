/**
 * SERVICES CAROUSEL COMPONENT
 * 
 * A carousel showcasing available services:
 * - Bin Cleaning (main service)
 * - Render Cleaning (coming soon)
 * - Power washing related services
 * - Mobile-responsive with snap scrolling
 * 
 * Design: TikTok-inspired carousel with service cards
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Home, Droplets, Car, Building, Wrench, Square, ChevronDown, ChevronUp, Sparkles, Calendar, RefreshCw, Copy, Zap, Sun } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'coming-soon';
  features: string[];
}

const services: Service[] = [
  {
    id: 'residential-cleaning',
    title: 'Residential Bin Cleaning',
    description: 'Professional home wheelie bin cleaning for families and households',
    icon: <Trash2 className="w-8 h-8" />,
    status: 'available',
    features: ['All bin sizes', 'Family-safe products', 'Weekly service', 'Odor elimination']
  },
  {
    id: 'commercial-cleaning',
    title: 'Commercial Bin Cleaning',
    description: 'Business waste bin cleaning for offices, shops, and commercial properties',
    icon: <Building className="w-8 h-8" />,
    status: 'available',
    features: ['Bulk discounts', 'Contract rates', 'Health compliance', 'Flexible timing']
  },
  {
    id: 'one-off-cleaning',
    title: 'One-Off Bin Cleaning',
    description: 'Single deep clean service for bins that need immediate attention',
    icon: <Sparkles className="w-8 h-8" />,
    status: 'available',
    features: ['No commitment', 'Same-day booking', 'Deep sanitization', 'Emergency service']
  },
  {
    id: 'monthly-cleaning',
    title: 'Monthly Regular Service',
    description: 'Scheduled monthly bin cleaning with automatic booking and discounts',
    icon: <Calendar className="w-8 h-8" />,
    status: 'available',
    features: ['Auto scheduling', 'Discount pricing', 'Priority booking', 'Reminder notifications']
  },
  {
    id: 'weekly-cleaning',
    title: 'Weekly Bin Service',
    description: 'Premium weekly cleaning for maximum hygiene and freshness',
    icon: <RefreshCw className="w-8 h-8" />,
    status: 'available',
    features: ['Maximum freshness', 'Priority service', 'Best value', 'Health guarantee']
  },
  {
    id: 'multiple-bins',
    title: 'Multiple Bin Cleaning',
    description: 'Cost-effective cleaning for households or businesses with multiple bins',
    icon: <Copy className="w-8 h-8" />,
    status: 'available',
    features: ['Multi-bin discounts', 'All bin types', 'Same visit cleaning', 'Volume pricing']
  },
  {
    id: 'emergency-cleaning',
    title: 'Emergency Clean Service',
    description: 'Urgent same-day cleaning for severely contaminated or pest-infested bins',
    icon: <Zap className="w-8 h-8" />,
    status: 'available',
    features: ['Same-day response', 'Pest treatment', 'Deep sanitization', 'Urgent priority']
  },
  {
    id: 'seasonal-cleaning',
    title: 'Seasonal Deep Clean',
    description: 'Intensive quarterly cleaning service for seasonal bin maintenance',
    icon: <Sun className="w-8 h-8" />,
    status: 'available',
    features: ['Quarterly service', 'Intensive clean', 'Seasonal prep', 'Weather protection']
  }
];

export default function ServicesCarousel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleServiceClick = (service: Service) => {
    if (service.status === 'available') {
      // Navigate to postcode checker for available services
      router.push('/');
    }
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-left">
          What we can offer
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-4 text-left">
          Professional cleaning services for your home business
        </p>
        
        {/* Expandable Description */}
        {isExpanded && (
          <p className="text-sm md:text-base text-gray-600 mb-4 text-left leading-relaxed">
            From residential wheelie bins to commercial waste management, we provide reliable, eco-friendly cleaning solutions across the UK. Our trained professionals use hot water treatment and biodegradable sanitizers to eliminate bacteria, odors, and grime. Book online today for same-day service or schedule regular cleaning contracts for your business.
          </p>
        )}
        
        {/* Read More Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-[#3B4044] hover:text-[#2a2d30] text-sm font-medium mb-6 transition-colors"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {/* Services Carousel */}
        <div className="relative -mx-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex-none w-[280px] md:w-[320px] snap-start"
              >
                <div 
                  className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 h-full relative ${
                    service.status === 'available' ? 'cursor-pointer hover:scale-[1.02]' : ''
                  }`}
                  onClick={() => handleServiceClick(service)}
                >
                  {/* Status Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-1">
                    {service.status === 'coming-soon' ? (
                      <>
                        <div className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                          Not Available
                        </div>
                        <div className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                          Coming Soon
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          Available Now
                        </div>
                        <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          Online Estimates
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Service Icon */}
                  <div className="w-16 h-16 bg-[#3B4044] text-white rounded-lg flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  
                  {/* Service Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  
                  {/* Service Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Features List */}
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-[#3B4044] rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Action Button */}
                  <div className="mt-6">
                    {service.status === 'available' ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push('/');
                        }}
                        className="w-full bg-[#3B4044] hover:bg-[#2a2d30] text-white font-medium py-2 px-4 rounded transition-colors"
                      >
                        Check Your Postcode
                      </button>
                    ) : (
                      <button 
                        disabled 
                        className="w-full bg-gray-200 text-gray-500 font-medium py-2 px-4 rounded cursor-not-allowed"
                      >
                        Notify Me
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
