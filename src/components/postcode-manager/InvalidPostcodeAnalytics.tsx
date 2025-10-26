'use client';

import { useState } from 'react';
import { BarChart3, Trash2, RefreshCw, TrendingUp, MapPin, Clock } from 'lucide-react';
import useInvalidPostcodeService from './hooks/useInvalidPostcodeService';

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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Demand Analytics</h2>
            <p className="text-gray-600">Track postcode requests in unserved areas</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          {invalidPostcodes.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{totalAttempts}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Areas</p>
              <p className="text-2xl font-bold text-gray-900">{invalidPostcodes.length}</p>
            </div>
            <MapPin className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg per Area</p>
              <p className="text-2xl font-bold text-gray-900">
                {invalidPostcodes.length > 0 ? Math.round(totalAttempts / invalidPostcodes.length) : 0}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Invalid Postcodes Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Demand by Area</h3>
          <p className="text-sm text-gray-600">Areas sorted by request frequency - potential expansion opportunities</p>
        </div>
        
        {invalidPostcodes.length === 0 ? (
          <div className="p-8 text-center">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No invalid postcode data yet</p>
            <p className="text-sm text-gray-400">Data will appear when users check postcodes in unserved areas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Area
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Example Postcode
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requests
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Latest Request
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demand Level
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invalidPostcodes.map((entry) => {
                  const demandLevel = entry.count >= 10 ? 'High' : entry.count >= 5 ? 'Medium' : 'Low';
                  const demandColor = entry.count >= 10 ? 'text-red-600 bg-red-100' : 
                                    entry.count >= 5 ? 'text-yellow-600 bg-yellow-100' : 
                                    'text-gray-600 bg-gray-100';
                  
                  return (
                    <tr key={entry.area} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{entry.area}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{entry.postcode}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-gray-900">{entry.count}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{formatDate(entry.timestamp)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${demandColor}`}>
                          {demandLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRemoveArea(entry.area)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1"
                          title={`Remove ${entry.area} data`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
