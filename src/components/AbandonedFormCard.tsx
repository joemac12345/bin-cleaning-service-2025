'use client';

import { Trash2, MessageCircle, TrendingDown, Clock } from 'lucide-react';

interface AbandonedFormCardProps {
  id: string;
  formData: any;
  completionPercentage: number;
  potentialValue: number;
  postcode: string;
  createdAt: string;
  status: 'abandoned' | 'contacted' | 'converted' | 'unqualified';
  onStatusChange: (id: string, status: string) => void;
  onRemove: (id: string) => void;
}

export default function AbandonedFormCard({
  id,
  formData,
  completionPercentage,
  potentialValue,
  postcode,
  createdAt,
  status,
  onStatusChange,
  onRemove,
}: AbandonedFormCardProps) {
  const statusConfig = {
    abandoned: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Abandoned' },
    contacted: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Contacted' },
    converted: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Converted' },
    unqualified: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300', label: 'Unqualified' },
  };

  const config = statusConfig[status];
  const completionColor = completionPercentage >= 75 ? 'text-green-600' : completionPercentage >= 50 ? 'text-yellow-600' : 'text-red-600';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className={`rounded-lg p-4 border border-zinc-200 dark:border-zinc-700 ${config.bg} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="font-semibold text-gray-900 dark:text-white">
            {formData?.firstName} {formData?.lastName}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{formData?.email || 'No email'}</div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${config.text}`}>
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-t border-zinc-200 dark:border-zinc-700 border-b">
        <div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Completion</div>
          <div className={`text-lg font-bold ${completionColor}`}>{completionPercentage}%</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Potential Value</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">£{potentialValue}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Postcode</div>
          <div className="text-sm font-mono text-gray-700 dark:text-gray-300">{postcode}</div>
        </div>
        <div className="flex items-start space-x-1">
          <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Date</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{formatDate(createdAt)}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onStatusChange(id, 'contacted')}
          disabled={status === 'contacted' || status === 'converted'}
          className="flex-1 px-2 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-1 text-xs font-medium"
        >
          <MessageCircle className="w-3 h-3" />
          <span>Mark Contacted</span>
        </button>
        <button
          onClick={() => onRemove(id)}
          className="px-2 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          title="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
