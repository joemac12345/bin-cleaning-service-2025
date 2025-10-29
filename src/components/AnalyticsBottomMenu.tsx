'use client';

import { BarChart3, TrendingUp, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';

interface AnalyticsBottomMenuProps {
  totalRequests: number;
  totalAreas: number;
  avgPerArea: number;
  highDemandCount: number;
  mediumDemandCount: number;
  lowDemandCount: number;
  topArea?: {
    area: string;
    count: number;
  };
  onRefresh: () => void;
  onClearAll: () => void;
  isLoading?: boolean;
  hasData: boolean;
}

export default function AnalyticsBottomMenu({
  totalRequests,
  totalAreas,
  avgPerArea,
  highDemandCount,
  mediumDemandCount,
  lowDemandCount,
  topArea,
  onRefresh,
  onClearAll,
  isLoading = false,
  hasData,
}: AnalyticsBottomMenuProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        {/* Top Section - Key Insights */}
        {hasData && topArea && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-3 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                Top Demand Area: <span className="text-red-600 dark:text-red-400">{topArea.area}</span>
              </p>
              <p className="text-xs text-red-800 dark:text-red-400">
                {topArea.count} requests - Strong expansion opportunity
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 px-3 sm:px-4 py-2 rounded-lg">
            <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">Total Requests</div>
            <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{totalRequests}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 px-3 sm:px-4 py-2 rounded-lg">
            <div className="text-xs sm:text-sm text-green-700 dark:text-green-300">Unique Areas</div>
            <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">{totalAreas}</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 px-3 sm:px-4 py-2 rounded-lg">
            <div className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">Avg / Area</div>
            <div className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{avgPerArea}</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 px-3 sm:px-4 py-2 rounded-lg">
            <div className="text-xs sm:text-sm text-orange-700 dark:text-orange-300">Avg per Area</div>
            <div className="text-lg sm:text-2xl font-bold text-orange-600 dark:text-orange-400">{avgPerArea}</div>
          </div>
        </div>

        {/* Demand Distribution */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-red-100 dark:bg-red-900/30 px-3 py-2 rounded-lg text-center">
            <div className="text-xs text-red-700 dark:text-red-300">High Demand</div>
            <div className="text-xl font-bold text-red-600 dark:text-red-400">{highDemandCount}</div>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 px-3 py-2 rounded-lg text-center">
            <div className="text-xs text-yellow-700 dark:text-yellow-300">Medium Demand</div>
            <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{mediumDemandCount}</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-center">
            <div className="text-xs text-gray-700 dark:text-gray-300">Low Demand</div>
            <div className="text-xl font-bold text-gray-600 dark:text-gray-400">{lowDemandCount}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            disabled={isLoading || !hasData}
            className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          {hasData && (
            <button
              onClick={onClearAll}
              className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
