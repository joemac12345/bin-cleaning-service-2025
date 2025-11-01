/**
 * SOCIAL MEDIA COMPONENT
 * 
 * A carousel showcasing social media platforms to attract followers:
 * - Instagram, Facebook, TikTok, Twitter/X
 * - Follow buttons and engagement stats
 * - Mobile-responsive with snap scrolling
 * - Matches TheBinGuy brand design
 * 
 * Design: TikTok-inspired carousel with social cards
 */

'use client';

import { Instagram, Facebook, MessageCircle, Twitter, ExternalLink, Users, Heart, Eye } from 'lucide-react';

interface SocialPlatform {
  id: string;
  name: string;
  handle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  followers: string;
  engagement: string;
  url: string;
  callToAction: string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@thebinguy',
    description: 'See amazing before & after bin transformations, behind-the-scenes cleaning action, and customer success stories!',
    icon: <Instagram className="w-8 h-8" />,
    color: '#E4405F',
    bgColor: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
    followers: '2.5K+',
    engagement: '1.2K',
    url: 'https://instagram.com/thebinguy',
    callToAction: 'Follow for Before & After'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: '@TheBinGuyUK',
    description: 'Join our community for cleaning tips, customer reviews, local service updates, and exclusive offers for your area!',
    icon: <Facebook className="w-8 h-8" />,
    color: '#1877F2',
    bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
    followers: '1.8K+',
    engagement: '850',
    url: 'https://facebook.com/thebinguyuk',
    callToAction: 'Like for Local Updates'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@thebinguy_uk',
    description: 'Watch satisfying cleaning videos, quick bin maintenance tips, and fun cleaning hacks that go viral!',
    icon: <MessageCircle className="w-8 h-8" />,
    color: '#000000',
    bgColor: 'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
    followers: '5.2K+',
    engagement: '3.1K',
    url: 'https://tiktok.com/@thebinguy_uk',
    callToAction: 'Follow for Satisfying Videos'
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    handle: '@TheBinGuy',
    description: 'Get real-time service updates, cleaning industry news, quick tips, and connect with our team directly!',
    icon: <Twitter className="w-8 h-8" />,
    color: '#1DA1F2',
    bgColor: 'bg-gradient-to-br from-blue-400 to-blue-500',
    followers: '920+',
    engagement: '450',
    url: 'https://twitter.com/thebinguy',
    callToAction: 'Follow for Updates'
  }
];

export default function SocialMediaCarousel() {
  const handleSocialClick = (platform: SocialPlatform) => {
    // Open social media link in new tab
    window.open(platform.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-left">
          Follow Our Journey! 📱
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-6 text-left">
          Join thousands of followers for cleaning tips, before & after photos, and behind-the-scenes content
        </p>
        
        {/* Social Cards Carousel */}
        <div className="relative -mx-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4">
            {socialPlatforms.map((platform) => (
              <div
                key={platform.id}
                className="flex-none w-[280px] md:w-[320px] snap-start"
              >
                <div 
                  className="bg-white rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 h-full relative cursor-pointer transform translate-y-[-2px]"
                  onClick={() => handleSocialClick(platform)}
                >
                  {/* Platform Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 ${platform.bgColor} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      {platform.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {platform.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {platform.handle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {platform.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{platform.followers}</span>
                      <span>followers</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Heart className="w-4 h-4" />
                      <span className="font-medium">{platform.engagement}</span>
                      <span>likes</span>
                    </div>
                  </div>
                  
                  {/* Follow Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSocialClick(platform);
                    }}
                    className="w-full bg-[#3B4044] hover:bg-[#2a2d30] text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {platform.callToAction}
                    <ExternalLink className="w-4 h-4" />
                  </button>
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
