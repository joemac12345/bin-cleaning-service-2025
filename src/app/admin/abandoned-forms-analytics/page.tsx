'use client';

import { useState, useEffect } from 'react';
import { TrendingDown, RefreshCw, Download, Trash2, Filter } from 'lucide-react';
import AbandonedFormCard from '@/components/AbandonedFormCard';

interface AbandonedForm {
  id: string;
  sessionId: string;
  postcode: string;
  formData: any;
  createdAt: string;
  lastUpdated: string;
  status: 'abandoned' | 'contacted' | 'converted' | 'unqualified';
  completionPercentage: number;
  potentialValue: number;
  contactInfo: {
    hasEmail: boolean;
    hasPhone: boolean;
    hasName: boolean;
  };
  notes?: string;
}

export default function AbandonedFormsAnalyticsPage() {
  const [forms, setForms] = useState<AbandonedForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyUncontacted, setShowOnlyUncontacted] = useState(true);

  const fetchForms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/abandoned-forms');
      const data = await response.json();

      if (data.success) {
        setForms(data.abandonedForms || []);
      } else {
        setError('Failed to load abandoned forms');
        setForms([]);
      }
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError('Error loading data');
      setForms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormStatus = async (formId: string, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/abandoned-forms', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formId, status, notes }),
      });

      if (response.ok) {
        await fetchForms();
      } else {
        alert('Failed to update form status');
      }
    } catch (err) {
      console.error('Error updating form:', err);
      alert('Error updating form');
    }
  };

  const removeForm = async (formId: string) => {
    if (!confirm('Remove this abandoned form record?')) return;

    try {
      const response = await fetch('/api/abandoned-forms', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formId }),
      });

      if (response.ok) {
        await fetchForms();
      } else {
        alert('Failed to remove form');
      }
    } catch (err) {
      console.error('Error removing form:', err);
      alert('Error removing form');
    }
  };

  const clearAllForms = async () => {
    const confirmMessage = `⚠️ WARNING: This will permanently delete all ${totalAbandoned} abandoned forms!\n\nThis action cannot be undone. Are you absolutely sure?`;
    
    if (!confirm(confirmMessage)) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/abandoned-forms?clearAll=true', {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('✅ All abandoned forms have been cleared successfully');
        await fetchForms();
      } else {
        alert('Failed to clear abandoned forms');
      }
    } catch (err) {
      console.error('Error clearing all forms:', err);
      alert('Error clearing all forms');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Postcode', 'Completion %', 'Potential Value', 'Status'];
    const csvContent = [
      headers.join(','),
      ...forms.map((form) =>
        [
          new Date(form.createdAt).toLocaleDateString(),
          `"${form.formData.firstName} ${form.formData.lastName}"`,
          form.formData.email || '',
          form.formData.phone || '',
          form.postcode,
          form.completionPercentage,
          `£${form.potentialValue}`,
          form.status,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abandoned-forms-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // Calculate total count
  const safeForms = forms || [];
  const totalAbandoned = safeForms.length;

  // Filter forms based on contact status
  const filteredForms = showOnlyUncontacted 
    ? safeForms.filter(f => f.status === 'abandoned')
    : safeForms;

  // Sort by most recent first
  const sortedForms = [...filteredForms].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="w-full px-4 py-6 pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Abandoned Forms</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {showOnlyUncontacted 
                ? `${sortedForms.length} uncontacted form${sortedForms.length !== 1 ? 's' : ''}`
                : `${totalAbandoned} total form${totalAbandoned !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          <button
            onClick={() => setShowOnlyUncontacted(!showOnlyUncontacted)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              showOnlyUncontacted
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">
              {showOnlyUncontacted ? 'Show All' : 'Hide Contacted'}
            </span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading...</p>
        </div>
      ) : sortedForms.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No abandoned forms</h2>
          <p className="text-gray-600 dark:text-gray-400">Incomplete bookings will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedForms.map((form) => (
            <AbandonedFormCard
              key={form.id}
              id={form.id}
              formData={form.formData}
              completionPercentage={form.completionPercentage}
              potentialValue={form.potentialValue}
              postcode={form.postcode}
              createdAt={form.createdAt}
              status={form.status}
              onStatusChange={updateFormStatus}
              onRemove={removeForm}
            />
          ))}
        </div>
      )}

      {/* Simple Action Bar */}
      {totalAbandoned > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {totalAbandoned} form{totalAbandoned !== 1 ? 's' : ''}
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchForms}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button
                onClick={clearAllForms}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
