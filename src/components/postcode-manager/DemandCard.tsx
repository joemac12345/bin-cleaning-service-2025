'use client';

import { Trash2, TrendingUp, Clock } from 'lucide-react';

interface DemandCardProps {
  area: string;
  postcode: string;
  count: number;
  timestamp: string;
  onRemove: (area: string) => void;
}

export default function DemandCard({
  area,
  postcode,
  count,
  timestamp,
  onRemove,
}: DemandCardProps) {
  const demandLevel = count >= 10 ? 'High' : count >= 5 ? 'Medium' : 'Low';
  const demandColor =
    count >= 10
      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      : count >= 5
        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';

  const demandBgColor =
    count >= 10
      ? 'bg-red-50 dark:bg-red-900/10'
      : count >= 5
        ? 'bg-yellow-50 dark:bg-yellow-900/10'
        : 'bg-gray-50 dark:bg-gray-900/10';

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`rounded-lg p-4 border border-zinc-200 dark:border-zinc-700 ${demandBgColor} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{area}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">{postcode}</div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${demandColor}`}>
          {demandLevel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 pt-3 border-t border-zinc-200 dark:border-zinc-700">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Requests</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
        </div>
        <div className="flex items-start space-x-1">
          <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Latest</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{formatDate(timestamp)}</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onRemove(area)}
        className="w-full px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center space-x-1 text-sm font-medium"
        title={`Remove ${area} data`}
      >
        <Trash2 className="w-4 h-4" />
        <span>Remove Data</span>
      </button>
    </div>
  );
}
