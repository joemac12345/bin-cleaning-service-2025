'use client';

import { useState } from 'react';
import { MapPin, BarChart3, TrendingDown } from 'lucide-react';
// Updated for email domain fix deployment
import AdminPostcodeManager from './AdminPostcodeManager';
import InvalidPostcodeAnalytics from './InvalidPostcodeAnalytics';
import AbandonedFormsAnalytics from '@/components/admin/AbandonedFormsAnalytics';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('postcodes');

  const tabs = [
    { id: 'postcodes', name: 'Service Areas', icon: MapPin },
    { id: 'analytics', name: 'Demand Analytics', icon: BarChart3 },
    { id: 'abandoned', name: 'Abandoned Forms', icon: TrendingDown }
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Simple Tab Navigation */}
      <div className="border-b mb-6">
        <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'postcodes' && <AdminPostcodeManager />}
        {activeTab === 'analytics' && <InvalidPostcodeAnalytics />}
        {activeTab === 'abandoned' && <AbandonedFormsAnalytics />}
      </div>
    </div>
  );
}
