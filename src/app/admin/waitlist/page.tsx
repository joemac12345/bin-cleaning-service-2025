'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  MapPin, 
  Clock,
  RefreshCw,
  Filter,
  Search,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Home
} from 'lucide-react';
import Link from 'next/link';

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  postcode: string;
  createdAt: string;
  status: 'pending' | 'contacted' | 'converted';
  notes?: string;
}

interface Stats {
  total: number;
  pending: number;
  contacted: number;
  converted: number;
}

export default function WaitlistAdminPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'contacted' | 'converted'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);

  // Fetch waitlist entries
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/waitlist');
      const data = await response.json();
      
      if (data.success) {
        // Map database format to component format
        const mappedEntries = data.entries.map((entry: any) => ({
          id: entry.id || entry.entry_id,
          name: entry.name,
          email: entry.email,
          postcode: entry.postcode,
          createdAt: entry.created_at,
          status: entry.status || 'pending',
          notes: entry.notes
        }));
        
        setEntries(mappedEntries);
        setStats(data.stats);
      } else {
        console.error('Failed to fetch waitlist:', data.error);
      }
    } catch (error) {
      console.error('Error fetching waitlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.postcode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || entry.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }
  };

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'contacted':
        return 'bg-blue-500';
      case 'converted':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'contacted':
        return <Mail className="w-4 h-4" />;
      case 'converted':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link 
                href="/admin"
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <span className="text-xl">←</span>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Waitlist</h1>
                <p className="text-sm text-zinc-400">Service expansion leads</p>
              </div>
            </div>
            
            <button
              onClick={fetchEntries}
              disabled={loading}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-zinc-800/50 px-3 py-2 rounded-lg">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-zinc-400">Total</div>
              </div>
              <div className="bg-zinc-800/50 px-3 py-2 rounded-lg">
                <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
                <div className="text-xs text-zinc-400">Pending</div>
              </div>
              <div className="bg-zinc-800/50 px-3 py-2 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">{stats.contacted}</div>
                <div className="text-xs text-zinc-400">Contacted</div>
              </div>
              <div className="bg-zinc-800/50 px-3 py-2 rounded-lg">
                <div className="text-2xl font-bold text-green-500">{stats.converted}</div>
                <div className="text-xs text-zinc-400">Converted</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or postcode..."
            className="w-full bg-zinc-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-zinc-600" />
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Users className="w-12 h-12 text-zinc-700 mb-3" />
            <p className="text-zinc-400 text-center">
              {searchTerm ? 'No results found' : 'No waitlist entries yet'}
            </p>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{entry.name}</h3>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(entry.status)}`} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(entry.createdAt)}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(entry.status)} bg-opacity-20 flex items-center gap-1`}>
                    {getStatusIcon(entry.status)}
                    <span className="capitalize">{entry.status}</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                    <span className="text-zinc-300 truncate">{entry.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                    <span className="text-zinc-300">{entry.postcode}</span>
                  </div>
                </div>

                {/* Notes */}
                {entry.notes && (
                  <div className="mt-3 pt-3 border-t border-zinc-800">
                    <p className="text-sm text-zinc-400">{entry.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Filter Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-4 py-3 safe-area-inset-bottom">
        <div className="flex items-center justify-around">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors text-zinc-500 hover:bg-zinc-800 hover:text-white"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          <button
            onClick={() => setFilterStatus('all')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">All</span>
          </button>

          <button
            onClick={() => setFilterStatus('pending')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'pending' ? 'bg-zinc-800 text-yellow-500' : 'text-zinc-500'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-xs font-medium">Pending</span>
          </button>

          <button
            onClick={() => setFilterStatus('contacted')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'contacted' ? 'bg-zinc-800 text-blue-500' : 'text-zinc-500'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span className="text-xs font-medium">Contacted</span>
          </button>

          <button
            onClick={() => setFilterStatus('converted')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'converted' ? 'bg-zinc-800 text-green-500' : 'text-zinc-500'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-xs font-medium">Converted</span>
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEntry && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50"
          onClick={() => setSelectedEntry(null)}
        >
          <div 
            className="bg-zinc-900 w-full sm:max-w-lg sm:rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-zinc-800 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Waitlist Details</h2>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Status */}
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Status</label>
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor(selectedEntry.status)} bg-opacity-20`}>
                  {getStatusIcon(selectedEntry.status)}
                  <span className="capitalize font-medium">{selectedEntry.status}</span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Name</label>
                <div className="bg-zinc-800 px-4 py-3 rounded-lg">
                  <p className="text-white">{selectedEntry.name}</p>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Email</label>
                <div className="bg-zinc-800 px-4 py-3 rounded-lg">
                  <a 
                    href={`mailto:${selectedEntry.email}`}
                    className="text-blue-400 hover:text-blue-300 break-all"
                  >
                    {selectedEntry.email}
                  </a>
                </div>
              </div>

              {/* Postcode */}
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Postcode</label>
                <div className="bg-zinc-800 px-4 py-3 rounded-lg">
                  <p className="text-white font-mono">{selectedEntry.postcode}</p>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Registered</label>
                <div className="bg-zinc-800 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <span>{new Date(selectedEntry.createdAt).toLocaleString('en-GB')}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Notes</label>
                <div className="bg-zinc-800 px-4 py-3 rounded-lg min-h-[100px]">
                  {selectedEntry.notes ? (
                    <p className="text-white">{selectedEntry.notes}</p>
                  ) : (
                    <p className="text-zinc-600 italic">No notes added</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <a
                  href={`mailto:${selectedEntry.email}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </a>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-6 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
