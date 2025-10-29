'use client';

import { useState } from 'react';
import { BarChart3, MapPin } from 'lucide-react';
import useInvalidPostcodeService from './hooks/useInvalidPostcodeService';
import DemandCard from './DemandCard';
import AnalyticsBottomMenu from '../AnalyticsBottomMenu';

export default function InvalidPostcodeAnalytics() {
  const { getByDemand, clearAll, removeArea, refresh } = useInvalidPostcodeService();
  const [isLoading, setIsLoading] = useState(false);
  
  const invalidPostcodes = getByDemand();
  const totalAttempts = invalidPostcodes.reduce((sum, entry) => sum + entry.count, 0);

  const handleRefresh = () => {
    setIsLoading(true);
    refresh();
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all invalid postcode data?')) {
      clearAll();
    }
  };

  const handleRemoveArea = (area: string) => {
    if (window.confirm(`Remove tracking data for ${area}?`)) {
      removeArea(area);
    }
  };

  const highDemandCount = invalidPostcodes.filter(e => e.count >= 10).length;
  const mediumDemandCount = invalidPostcodes.filter(e => e.count >= 5 && e.count < 10).length;
  const lowDemandCount = invalidPostcodes.filter(e => e.count < 5).length;
  const avgPerArea = invalidPostcodes.length > 0 ? Math.round(totalAttempts / invalidPostcodes.length) : 0;
  const topArea = invalidPostcodes[0]; // Already sorted by demand in getByDemand()

  return (
    <div className="w-full pb-96">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-700 dark:to-red-700 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Demand Analytics</h1>
              <p className="text-orange-100 mt-1">Unserved areas with the highest demand for expansion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {invalidPostcodes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No demand data yet</h2>
          <p className="text-gray-600 dark:text-gray-400">Data will appear when users check postcodes in unserved areas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invalidPostcodes.map((entry) => (
            <DemandCard
              key={entry.area}
              area={entry.area}
              postcode={entry.postcode}
              count={entry.count}
              timestamp={entry.timestamp}
              onRemove={handleRemoveArea}
            />
          ))}
        </div>
      )}

      {/* Bottom Menu */}
      <AnalyticsBottomMenu
        totalRequests={totalAttempts}
        totalAreas={invalidPostcodes.length}
        avgPerArea={avgPerArea}
        highDemandCount={highDemandCount}
        mediumDemandCount={mediumDemandCount}
        lowDemandCount={lowDemandCount}
        topArea={topArea}
        onRefresh={handleRefresh}
        onClearAll={handleClearAll}
        isLoading={isLoading}
        hasData={invalidPostcodes.length > 0}
      />
    </div>
  );
}
