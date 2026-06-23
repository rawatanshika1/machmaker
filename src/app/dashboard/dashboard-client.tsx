"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomers, getStatusOptions, getCities } from '@/lib/customers';
import { getAvatarUrlSimple } from '@/lib/avatar';
import { Badge } from '@/components/badge';
import { ChatBox } from '@/components/chat-box';
import { SearchChat } from './components/search-chat';
import { Search, Sparkles, LogOut } from 'lucide-react';

const customers = getCustomers();

export function DashboardClient() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers
      .filter((customer) => statusFilter === 'All' || customer.status === statusFilter)
      .filter((customer) => cityFilter === 'All' || customer.city === cityFilter)
      .filter((customer) => {
        const term = search.trim().toLowerCase();
        if (!term) return true;
        return [customer.firstName, customer.lastName, customer.city, customer.email].some((field) =>
          field.toLowerCase().includes(term),
        );
      });
  }, [statusFilter, cityFilter, search]);

  return (
    <>
      {/* Sticky Navbar with Glassmorphism */}
      <nav className="glass-navbar sticky top-0 z-30 border-b border-brand-200/20">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-700">
                Starlit
              </h1>
            </div>
            <button
              onClick={async () => {
                const response = await fetch('/api/logout', { method: 'POST' });
                if (response.ok) {
                  router.push('/login');
                }
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-100 text-brand-700 px-4 py-2 text-sm font-semibold transition hover:bg-brand-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Hero Banner */}
          <div className="mb-8 rounded-[24px] overflow-hidden bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 p-8 shadow-lg">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold text-white">
                Welcome back, Matchmaker <span className="text-3xl">✨</span>
              </h1>
              <p className="text-brand-100 text-lg">Discover meaningful connections and make perfect matches</p>
            </div>
          </div>

          {/* Stats and Controls */}
          <div className="mb-8 flex flex-col gap-6 rounded-[16px] border border-brand-200/20 bg-white p-8 shadow-card sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600 font-semibold">Customer Database</p>
              <h2 className="mt-3 text-2xl font-semibold text-brand-900">Profiles & Opportunities</h2>
              <p className="mt-2 text-brand-700">Review customer profiles, apply smart filters, and identify perfect matches.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700 font-semibold border border-brand-100">
                <Sparkles className="h-4 w-4 text-brand-600" />
                {filteredCustomers.length} profiles
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[16px] border border-brand-200/20 bg-white p-6 shadow-card">
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-sm font-medium text-brand-900">
                  Status
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-brand-200 bg-white px-4 py-3 text-sm text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  >
                    {getStatusOptions().map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-brand-900">
                  City
                  <select
                    value={cityFilter}
                    onChange={(event) => setCityFilter(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-brand-200 bg-white px-4 py-3 text-sm text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  >
                    {getCities().map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-brand-900">
                  Search
                  <div className="relative mt-2">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Name, city, email"
                      className="w-full rounded-2xl border border-brand-200 bg-white py-3 pl-11 pr-4 text-sm text-brand-900 placeholder-brand-400 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </label>
              </div>
            </section>

            <SearchChat />
          </div>

          {/* Customers Table */}
          <div className="overflow-hidden rounded-[16px] border border-brand-200/20 bg-white shadow-card">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-brand-50 text-brand-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Age</th>
                  <th className="px-6 py-4 font-semibold">City</th>
                  <th className="px-6 py-4 font-semibold">Marital Status</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const age = Math.max(18, new Date().getFullYear() - new Date(customer.dob).getFullYear());
                  const avatarUrl = getAvatarUrlSimple(customer.firstName, customer.gender);
                  return (
                    <tr 
                      key={customer.id} 
                      className="border-t border-brand-100 transition hover:bg-brand-50 cursor-pointer card-hover"
                      onClick={() => window.location.href = `/customer/${customer.id}`}
                    >
                      <td className="px-6 py-5">
                        <a 
                          href={`/customer/${customer.id}`} 
                          className="flex items-center gap-3 font-semibold text-brand-900 hover:text-brand-600 transition"
                        >
                          <div className="relative h-8 w-8 flex-shrink-0">
  <img 
    src={avatarUrl} 
    alt={`${customer.firstName} ${customer.lastName}`}
    className="h-8 w-8 rounded-full border border-brand-200"
    onError={(e) => {
      (e.target as HTMLImageElement).style.display = 'none';
      const fallback = (e.target as HTMLImageElement).nextSibling as HTMLElement;
      if (fallback) fallback.style.display = 'flex';
    }}
  />
  <div 
    className="h-8 w-8 rounded-full bg-brand-600 text-white text-xs font-bold items-center justify-center absolute top-0 left-0"
    style={{display: 'none'}}
  >
    {customer.firstName?.[0]}{customer.lastName?.[0]}
  </div>
</div>
                          {customer.firstName} {customer.lastName}
                        </a>
                      </td>
                      <td className="px-6 py-5 text-brand-700">{age}</td>
                      <td className="px-6 py-5 text-brand-700">{customer.city}</td>
                      <td className="px-6 py-5 text-brand-700">{customer.maritalStatus}</td>
                      <td className="px-6 py-5">
                        <Badge
                          label={customer.status}
                          variant={
                            customer.status === 'Matched'
                              ? 'success'
                              : customer.status === 'In Progress'
                              ? 'warning'
                              : 'default'
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-brand-600">
                      No profiles match that filter. Try a different city, status, or keyword.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Chat Box */}
      <ChatBox />
    </>
  );
}
