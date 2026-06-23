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
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">⭐</div>
          <h1 className="text-4xl font-bold text-white mb-2">Starlit</h1>
          <p className="text-brand-100 text-lg">Where meaningful connections begin</p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-2">Welcome back</h2>
          <p className="text-brand-100 text-sm mb-8">Sign in to your matchmaker account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-white mb-2 block">Username</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none transition focus:border-white/50 focus:bg-white/20 focus:ring-2 focus:ring-white/30"
                placeholder="Enter your username"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-white mb-2 block">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none transition focus:border-white/50 focus:bg-white/20 focus:ring-2 focus:ring-white/30"
                placeholder="Enter your password"
              />
            </label>
            {error ? <p className="text-sm text-red-200">{error}</p> : null}
            <button 
              type="submit" 
              className="w-full rounded-2xl bg-white text-brand-600 px-4 py-3 text-sm font-semibold transition hover:bg-brand-50 shadow-lg hover:shadow-xl"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/70">
            Demo credentials: <span className="font-semibold text-white">matchmaker</span> / <span className="font-semibold text-white">secret123</span>
          </p>
        </div>
      </div>
    </main>
  );
}
