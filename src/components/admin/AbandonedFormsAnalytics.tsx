'use client';

import { useState, useEffect } from 'react';
import { TrendingDown, Users, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

interface AbandonedForm {
  id: string;
  form_id: string;
  form_data: any;
  page_url: string;
  user_agent: string;
  abandoned_at: string;
  created_at: string;
}

interface AbandonedFormsStats {
  totalAbandoned: number;
  last24Hours: number;
  conversionOpportunities: number;
  topAbandonmentFields: { field: string; count: number }[];
}

export default function AbandonedFormsAnalytics() {
  const [abandonedForms, setAbandonedForms] = useState<AbandonedForm[]>([]);
  const [stats, setStats] = useState<AbandonedFormsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAbandonedForms();
  }, []);

  const fetchAbandonedForms = async () => {
    try {
      setIsLoading(true);
      console.log('📊 Fetching abandoned forms analytics...');

      const response = await fetch('/api/abandoned-forms', {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch abandoned forms');
      }

      const data = await response.json();
      setAbandonedForms(data.abandonedForms || []);
      
      // Calculate stats
      calculateStats(data.abandonedForms || []);
      
      console.log('✅ Abandoned forms loaded:', data.abandonedForms?.length || 0);

    } catch (err) {
      console.error('❌ Error fetching abandoned forms:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (forms: AbandonedForm[]) => {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentForms = forms.filter(form => 
      new Date(form.created_at) >= last24Hours
    );

    // Analyze abandonment points
    const fieldCounts: { [key: string]: number } = {};
    
    forms.forEach(form => {
      const formData = form.form_data || {};
      
      // Count which fields have data
      Object.keys(formData).forEach(field => {
        if (formData[field] && formData[field].toString().trim().length > 0) {
          fieldCounts[field] = (fieldCounts[field] || 0) + 1;
        }
      });
    });

    const topAbandonmentFields = Object.entries(fieldCounts)
      .map(([field, count]) => ({ field, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setStats({
      totalAbandoned: forms.length,
      last24Hours: recentForms.length,
      conversionOpportunities: forms.length,
      topAbandonmentFields
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getCompletionPercentage = (formData: any) => {
    const totalPossibleFields = 8; // Rough estimate of form fields
    const completedFields = Object.keys(formData || {}).filter(key => {
      const value = formData[key];
      return value && value.toString().trim().length > 0;
    }).length;
    
    return Math.round((completedFields / totalPossibleFields) * 100);
  };

  const formatFieldName = (field: string) => {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="animate-spin rounded-full h-8 w-8 text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading abandoned forms analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-red-700 dark:text-red-300 font-medium">Error loading abandoned forms</p>
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchAbandonedForms}
            className="mt-3 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Abandoned</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAbandoned}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Forms started but not completed
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last 24 Hours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.last24Hours}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Recent abandonment activity
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Opportunities</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.conversionOpportunities}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Potential customers to follow up
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Abandoned Forms</h2>
        <button
          onClick={fetchAbandonedForms}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Abandoned Forms List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {abandonedForms.length === 0 ? (
          <div className="p-8 text-center">
            <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No abandoned forms yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Abandoned forms will appear here when users start but don't complete bookings
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left max-w-md mx-auto">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">What are abandoned forms?</h4>
              <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                <li>• Forms users started but didn't complete</li>
                <li>• Valuable insights into user behavior</li>
                <li>• Opportunities for follow-up and conversion</li>
                <li>• Data to improve your booking process</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {abandonedForms.map((form) => (
              <div key={form.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Form ID: {form.form_id}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getCompletionPercentage(form.form_data) > 50 
                          ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300'
                          : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {getCompletionPercentage(form.form_data)}% Complete
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Abandoned: {formatDate(form.abandoned_at)}
                    </p>
                    
                    {form.form_data && Object.keys(form.form_data).length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Form Data:</p>
                        <div className="space-y-1">
                          {Object.entries(form.form_data).slice(0, 5).map(([key, value]) => (
                            <div key={key} className="flex text-xs">
                              <span className="font-medium text-gray-600 dark:text-gray-400 w-24 truncate">
                                {formatFieldName(key)}:
                              </span>
                              <span className="text-gray-800 dark:text-gray-200 ml-2 truncate">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                          {Object.keys(form.form_data).length > 5 && (
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              ... and {Object.keys(form.form_data).length - 5} more fields
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Abandonment Fields */}
      {stats && stats.topAbandonmentFields.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Most Completed Fields Before Abandonment
          </h3>
          <div className="space-y-3">
            {stats.topAbandonmentFields.map((field, index) => {
              const maxCount = Math.max(...stats.topAbandonmentFields.map(f => f.count));
              const percentage = (field.count / maxCount) * 100;
              
              return (
                <div key={field.field} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatFieldName(field.field)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-20">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">{field.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              💡 <strong>Tip:</strong> Fields with higher completion rates indicate where users lose interest. 
              Consider simplifying the form or providing better guidance at these points.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
