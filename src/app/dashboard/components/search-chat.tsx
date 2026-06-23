'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/badge';
import { Sparkles } from 'lucide-react';

export function SearchChat() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string; reason: string; score: number }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        const responseData = await response.json().catch(() => null);
        const errorMessage = responseData?.error || 'Search API returned an error';
        console.error('Search API returned an error:', errorMessage);
        setError(errorMessage);
        setResults([]);
        return;
      }

      const data = await response.json();
      if (data?.error) {
        console.error('Search API error response:', data.error);
        setError(data.error);
        setResults([]);
      } else {
        setError('');
        setResults(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error querying search API:', error);
      setError(error instanceof Error ? error.message : 'Error querying search API');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[16px] border border-brand-200/20 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600 font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Co-Pilot
          </p>
          <h2 className="mt-2 text-lg font-semibold text-brand-900">Smart search assistant</h2>
        </div>
        <button 
          onClick={handleSearch} 
          disabled={loading} 
          className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 text-white px-4 py-2 text-sm font-semibold transition hover:shadow-lg disabled:cursor-not-allowed disabled:bg-brand-300"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <input 
        value={query} 
        onChange={(event) => setQuery(event.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Find profiles by city, values, or relocation..." 
        className="w-full rounded-2xl border border-brand-200 bg-white px-4 py-3 text-sm text-brand-900 placeholder-brand-500 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" 
      />
      <div className="mt-6 space-y-4">
        {results.map((result) => (
          <div key={result.id} className="rounded-[16px] border border-brand-200/20 bg-gradient-to-br from-brand-50 to-brand-100 p-4 card-hover">
            <div className="flex items-center justify-between gap-3">
              <button 
                onClick={() => router.push(`/customer/${result.id}`)} 
                className="text-left text-sm font-semibold text-brand-600 hover:text-brand-700 transition"
              >
                View profile {result.id}
              </button>
              <Badge label={`${result.score}%`} variant={result.score > 75 ? 'success' : result.score > 50 ? 'warning' : 'muted'} />
            </div>
            <p className="mt-2 text-sm text-brand-800">{result.reason}</p>
          </div>
        ))}
      </div>
      {error ? <p className="mt-5 text-sm text-red-600 bg-red-50 p-3 rounded-[12px]">⚠️ {error}</p> : null}
      {results.length === 0 && !loading && !error ? <p className="mt-5 text-sm text-brand-600">💡 Ask about relocation, religion, careers, or family preferences.</p> : null}
    </div>
  );
}
