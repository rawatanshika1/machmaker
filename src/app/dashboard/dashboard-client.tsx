"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomers, getStatusOptions, getCities } from '@/lib/customers';
import { Badge } from '@/components/badge';
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
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-6 rounded-[32px] border border-slate-200 bg-white p-8 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Matchmaker dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Customer list</h1>
            <p className="mt-2 text-slate-600">Review customers, filter opportunities, and open individual biodata pages.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <Sparkles className="h-4 w-4 text-brand-600" />
              {filteredCustomers.length} profiles
            </div>

            <button
              onClick={async () => {
                const response = await fetch('/api/logout', { method: 'POST' });
                if (response.ok) {
                  router.push('/login');
                }
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm font-medium text-slate-700">
                Status
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500"
                >
                  {getStatusOptions().map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                City
                <select
                  value={cityFilter}
                  onChange={(event) => setCityFilter(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500"
                >
                  {getCities().map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Search
                <div className="relative mt-2">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Name, city, email"
                    className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-brand-500"
                  />
                </div>
              </label>
            </div>
          </section>

          <SearchChat />
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Marital Status</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const age = Math.max(18, new Date().getFullYear() - new Date(customer.dob).getFullYear());
                return (
                  <tr key={customer.id} className="border-t border-slate-200 transition hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <a href={`/customer/${customer.id}`} className="font-medium text-slate-900 hover:text-brand-600">
                        {customer.firstName} {customer.lastName}
                      </a>
                    </td>
                    <td className="px-6 py-5 text-slate-600">{age}</td>
                    <td className="px-6 py-5 text-slate-600">{customer.city}</td>
                    <td className="px-6 py-5 text-slate-600">{customer.maritalStatus}</td>
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
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No profiles match that filter. Try a different city, status, or keyword.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
