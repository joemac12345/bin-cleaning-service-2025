/**
 * STORY DEMO PAGE
 * 
 * Raw component demonstration - no extra containers
 * Just the pure Story component for CSS testing
 */

'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SeeOurWorkSection } from '@/components/Stories';
import TitleSubtitle from '@/components/TitleSubtitle';

export default function StoryDemoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Story Component - Raw Demo</h1>
              <p className="text-sm text-gray-600">Pure component without extra containers • Test CSS here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Component - No Extra Containers */}
      <div className="py-8">
        <TitleSubtitle 
          avatarImage="/image123456.png"
          header="our weekly bin cleaning service"
          postedBy="The Wheelie Bin Cleaners "
          fullText=""
          shortText="Just add some text here to see what it doesJust add some text here to see what it doesJust add some text here to see what it doesJust add some text here to see what it doesJust<br> add some text here to see what it doesJust add some text here to see what it does."
          backgroundColor="#ffffffff"
        />
        <SeeOurWorkSection />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            Raw Story Component Demo • No extra styling or containers
          </p>
        </div>
      </div>
    </div>
  );
}
