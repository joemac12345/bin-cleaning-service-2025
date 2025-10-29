'use client';

import { useState, useEffect } from 'react';
import { TrendingDown } from 'lucide-react';
import AbandonedFormCard from '@/components/AbandonedFormCard';
import AbandonedFormsBottomMenu from '@/components/AbandonedFormsBottomMenu';

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

  const fetchForms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/abandoned-forms');
      const data = await response.json();

      if (data.success) {
        setForms(data.forms);
      } else {
        setError('Failed to load abandoned forms');
      }
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError('Error loading data');
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

  // Calculate statistics
  const totalAbandoned = forms.length;
  const contactedCount = forms.filter((f) => f.status === 'contacted').length;
  const convertedCount = forms.filter((f) => f.status === 'converted').length;
  const unconvertedCount = forms.filter((f) => f.status === 'abandoned').length;
  const totalPotentialValue = forms.reduce((sum, f) => sum + f.potentialValue, 0);

  // Get forms from last 24 hours
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last24HoursCount = forms.filter((f) => new Date(f.createdAt) >= last24Hours).length;

  // Sort by completion percentage (highest first)
  const sortedForms = [...forms].sort((a, b) => b.completionPercentage - a.completionPercentage);

  return (
    <div className="w-full pb-96">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-700 dark:to-pink-700 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Abandoned Forms Analytics</h1>
              <p className="text-red-100 mt-1">Track and recover incomplete bookings with high-value conversion opportunities</p>
            </div>
          </div>
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
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading abandoned forms...</p>
        </div>
      ) : sortedForms.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No abandoned forms yet</h2>
          <p className="text-gray-600 dark:text-gray-400">Keep an eye on this page - incomplete bookings will appear here</p>
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

      {/* Bottom Menu */}
      <AbandonedFormsBottomMenu
        totalAbandoned={totalAbandoned}
        contactedCount={contactedCount}
        convertedCount={convertedCount}
        unconvertedCount={unconvertedCount}
        totalPotentialValue={totalPotentialValue}
        last24Hours={last24HoursCount}
        onRefresh={fetchForms}
        onExport={exportToCSV}
        isLoading={isLoading}
        hasData={totalAbandoned > 0}
      />
    </div>
  );
}
