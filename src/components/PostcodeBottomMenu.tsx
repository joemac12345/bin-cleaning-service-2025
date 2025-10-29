'use client';

import { Plus, Search, Download } from 'lucide-react';

interface PostcodeBottomMenuProps {
  activeCount: number;
  inactiveCount: number;
  totalCount: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddClick: () => void;
  onExport: () => void;
  isLoading?: boolean;
}

export default function PostcodeBottomMenu({
  activeCount,
  inactiveCount,
  totalCount,
  searchTerm,
  onSearchChange,
  onAddClick,
  onExport,
  isLoading = false,
}: PostcodeBottomMenuProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
          <div className="bg-green-50 dark:bg-green-900/20 px-3 sm:px-4 py-2 rounded-lg">
            <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">{activeCount}</div>
            <div className="text-xs sm:text-sm text-green-700 dark:text-green-300">Active</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 px-3 sm:px-4 py-2 rounded-lg">
            <div className="text-lg sm:text-xl font-bold text-yellow-600 dark:text-yellow-400">{inactiveCount}</div>
            <div className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">Inactive</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 px-3 sm:px-4 py-2 rounded-lg">
            <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">{totalCount}</div>
            <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">Total</div>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search postcodes..."
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onExport}
              disabled={isLoading || totalCount === 0}
              className="px-3 sm:px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-sm"
              title="Export postcodes as JSON"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={onAddClick}
              disabled={isLoading}
              className="px-4 sm:px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-1 sm:space-x-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Area</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
