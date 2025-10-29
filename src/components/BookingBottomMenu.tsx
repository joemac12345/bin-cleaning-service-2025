'use client';

import { RefreshCw, CheckCircle, CheckCheck } from 'lucide-react';

interface BookingBottomMenuProps {
  showCompleted: boolean;
  onToggleShowCompleted: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  activeJobsCount: number;
  completedJobsCount: number;
  onFilterPending?: () => void;
  onFilterAll?: () => void;
}

export default function BookingBottomMenu({
  showCompleted,
  onToggleShowCompleted,
  onRefresh,
  isLoading,
  activeJobsCount,
  completedJobsCount,
  onFilterPending,
  onFilterAll,
}: BookingBottomMenuProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-white">{activeJobsCount}</span>
              <span className="ml-1">Active Jobs</span>
            </div>
            {completedJobsCount > 0 && (
              <div className="text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-zinc-900 dark:text-white">{completedJobsCount}</span>
                <span className="ml-1">Completed</span>
              </div>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Filter Buttons */}
            <button
              onClick={onFilterPending || onToggleShowCompleted}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                !showCompleted 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Pending</span>
            </button>
            
            <button
              onClick={onFilterAll || onToggleShowCompleted}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                showCompleted 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600'
              }`}
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">All</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh bookings"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
