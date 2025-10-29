'use client';

import { MapPin, Trash2, Power } from 'lucide-react';

interface PostcodeCardProps {
  id: string;
  postcode: string;
  area: string;
  isActive: boolean;
  dateAdded: string;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function PostcodeCard({
  id,
  postcode,
  area,
  isActive,
  dateAdded,
  onToggle,
  onRemove,
}: PostcodeCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-mono font-semibold text-gray-900 dark:text-white text-sm">{postcode}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{area}</div>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
            isActive
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">{dateAdded}</div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggle(id)}
            className={`p-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
            }`}
            title={isActive ? 'Deactivate' : 'Activate'}
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(id)}
            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
