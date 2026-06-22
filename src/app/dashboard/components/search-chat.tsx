'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/badge';

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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">AI co-pilot</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Ask the matchmaker assistant</h2>
        </div>
        <button onClick={handleSearch} disabled={loading} className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-slate-300">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_0.8fr]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find profiles by city, values, or relocation" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500" />
      </div>
      <div className="mt-6 space-y-4">
        {results.map((result) => (
          <div key={result.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => router.push(`/customer/${result.id}`)} className="text-left text-sm font-semibold text-brand-600 hover:underline">
                View profile {result.id}
              </button>
              <Badge label={`${result.score}%`} variant={result.score > 75 ? 'success' : result.score > 50 ? 'warning' : 'muted'} />
            </div>
            <p className="mt-2 text-sm text-slate-600">{result.reason}</p>
          </div>
        ))}
      </div>
      {error ? <p className="mt-5 text-sm text-red-600">{error}</p> : null}
      {results.length === 0 && !loading && !error ? <p className="mt-5 text-sm text-slate-500">Ask the AI about relocation, religion, careers, or family preferences.</p> : null}
    </div>
  );
}
