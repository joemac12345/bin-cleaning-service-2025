'use client';

import { RefreshCw, Eye, EyeOff } from 'lucide-react';

interface BookingBottomMenuProps {
  showCompleted: boolean;
  onToggleShowCompleted: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  activeJobsCount: number;
  completedJobsCount: number;
}

export default function BookingBottomMenu({
  showCompleted,
  onToggleShowCompleted,
  onRefresh,
  isLoading,
  activeJobsCount,
  completedJobsCount,
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
            {/* Toggle Show Completed Button */}
            <button
              onClick={onToggleShowCompleted}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                showCompleted
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
              title={showCompleted ? 'Hide completed jobs' : 'Show completed jobs'}
            >
              {showCompleted ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span className="hidden sm:inline">Hide Completed</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Show All</span>
                </>
              )}
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
