'use client';

import { TrendingDown, Users, AlertCircle, RefreshCw, Download } from 'lucide-react';

interface AbandonedFormsBottomMenuProps {
  totalAbandoned: number;
  contactedCount: number;
  convertedCount: number;
  unconvertedCount: number;
  totalPotentialValue: number;
  last24Hours: number;
  topField?: {
    field: string;
    count: number;
  };
  onRefresh: () => void;
  onExport: () => void;
  isLoading?: boolean;
  hasData: boolean;
}

export default function AbandonedFormsBottomMenu({
  totalAbandoned,
  contactedCount,
  convertedCount,
  unconvertedCount,
  totalPotentialValue,
  last24Hours,
  topField,
  onRefresh,
  onExport,
  isLoading = false,
  hasData,
}: AbandonedFormsBottomMenuProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        {/* Key Insight Alert */}
        {hasData && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                Potential Revenue: <span className="text-amber-600 dark:text-amber-400">£{totalPotentialValue}</span>
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-400">
                {unconvertedCount} forms waiting to be contacted - {last24Hours} abandoned in last 24 hours
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-red-50 dark:bg-red-900/20 px-3 sm:px-4 py-2 rounded-lg">
            <div className="text-xs sm:text-sm text-red-700 dark:text-red-300">Total Abandoned</div>
            <div className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">{totalAbandoned}</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 px-3 sm:px-4 py-2 rounded-lg">
            <div className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">Contacted</div>
            <div className="text-lg sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{contactedCount}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 px-3 sm:px-4 py-2 rounded-lg">
            <div className="text-xs sm:text-sm text-green-700 dark:text-green-300">Converted</div>
            <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">{convertedCount}</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 px-3 sm:px-4 py-2 rounded-lg">
            <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">To Contact</div>
            <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{unconvertedCount}</div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-700 dark:text-purple-300">Conversion Rate</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {totalAbandoned > 0 ? Math.round((convertedCount / totalAbandoned) * 100) : 0}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-pink-700 dark:text-pink-300">Outstanding Value</p>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">£{totalPotentialValue}</p>
            </div>
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
              onClick={onExport}
              className="flex-1 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
