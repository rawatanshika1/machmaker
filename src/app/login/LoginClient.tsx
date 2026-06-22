'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginClient() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data?.error || 'Invalid credentials. Try matchmaker / secret123.');
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Login request failed:', error);
      setError('Unable to sign in. Please try again.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-card">
        <h1 className="text-3xl font-semibold text-slate-900">Matchmaker login</h1>
        <p className="mt-2 text-sm text-slate-600">Use the seeded matchmaker account to access all customers.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500"
            />
          </label>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button type="submit" className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
