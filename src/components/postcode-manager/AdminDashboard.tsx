'use client';

import { useState } from 'react';
import { MapPin, BarChart3 } from 'lucide-react';
import AdminPostcodeManager from './AdminPostcodeManager';
import InvalidPostcodeAnalytics from './InvalidPostcodeAnalytics';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('postcodes');

  const tabs = [
    { id: 'postcodes', name: 'Service Areas', icon: MapPin },
    { id: 'analytics', name: 'Demand Analytics', icon: BarChart3 },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Tab Navigation */}
      <div className="border-b border-zinc-200 dark:border-zinc-700 mb-6">
        <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-black dark:border-white text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-zinc-300 dark:hover:border-zinc-700'
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
      </div>
    </div>
  );
}
