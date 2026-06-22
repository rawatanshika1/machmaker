'use client';

import { useMemo, useState } from 'react';
import { getTopMatches, getMatchInsights, getCompatibilityScore } from '@/lib/matching';
import { getCustomers } from '@/lib/customers';
import { Badge } from '@/components/badge';
import { SendMatchModal } from './send-match-modal';
import { useToast, ToastContainer } from '@/components/toast';
import { Customer } from '@/types/customer';

interface CustomerDetailClientProps {
  customer: Customer;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="text-sm text-slate-700">{value}</p>
    </div>
  );
}

function NoteCard({ message, createdAt }: { message: string; createdAt: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm text-slate-700">{message}</p>
      <p className="mt-3 text-xs text-slate-500">{new Date(createdAt).toLocaleString()}</p>
    </div>
  );
}

export function CustomerDetailClient({ customer }: CustomerDetailClientProps) {
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState(customer.notes ?? []);
  const [selectedMatch, setSelectedMatch] = useState<Customer | null>(null);
  const { toasts, showToast } = useToast();

  const topMatches = useMemo(() => getTopMatches(customer, getCustomers()), [customer]);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const newNote = { id: `${Date.now()}`, message: noteText.trim(), createdAt: new Date().toISOString() };
    setNotes((prev) => [newNote, ...prev]);
    setNoteText('');
  };

  const handleSendMatch = () => {
    if (selectedMatch) {
      showToast(`Match sent to ${selectedMatch.firstName}!`);
      setSelectedMatch(null);
    }
  };

  const insights = getMatchInsights(customer, topMatches[0]?.candidate ?? customer);
  const compatibility = topMatches[0] ? getCompatibilityScore(customer, topMatches[0].candidate) : 0;

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-card">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Customer detail</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{customer.firstName} {customer.lastName}</h1>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <Badge label={customer.gender} />
                <Badge label={customer.city} />
                <Badge label={customer.status} variant={customer.status === 'Matched' ? 'success' : customer.status === 'In Progress' ? 'warning' : 'default'} />
              </div>
            </div>
            <div className="space-y-2 rounded-3xl bg-slate-50 px-6 py-5 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Compatibility sample:</span> {compatibility}%</p>
              <p className="text-slate-500">Based on top candidate alignment with values, lifestyle, career, and family goals.</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Personal</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <DetailRow label="Date of birth" value={new Date(customer.dob).toLocaleDateString()} />
                <DetailRow label="Marital status" value={customer.maritalStatus} />
                <DetailRow label="Country" value={customer.country} />
                <DetailRow label="Languages" value={customer.languages.join(', ')} />
                <DetailRow label="Family type" value={customer.familyType} />
                <DetailRow label="Diet" value={customer.dietPreference} />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Career</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <DetailRow label="Degree" value={customer.degree} />
                <DetailRow label="College" value={customer.undergradCollege} />
                <DetailRow label="Company" value={customer.company} />
                <DetailRow label="Designation" value={customer.designation} />
                <DetailRow label="Income" value={`₹${customer.income.toLocaleString()}`} />
                <DetailRow label="Phone / Email" value={`${customer.phone} · ${customer.email}`} />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Family / values</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <DetailRow label="Religion" value={customer.religion} />
                <DetailRow label="Caste" value={customer.caste} />
                <DetailRow label="Manglik" value={customer.manglikStatus} />
                <DetailRow label="Siblings" value={customer.siblings} />
                <DetailRow label="Want kids" value={customer.wantKids ? 'Yes' : 'No'} />
                <DetailRow label="Open to relocate" value={customer.openToRelocate ? 'Yes' : 'No'} />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <DetailRow label="City preference" value={customer.city} />
                <DetailRow label="Pets" value={customer.openToPets ? 'Open' : 'Not open'} />
                <DetailRow label="Horoscope" value={customer.horoscopeSign} />
                <DetailRow label="Lifestyle habits" value={customer.habits.join(', ')} />
              </div>
            </section>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900">Notes</h2>
              <button onClick={handleAddNote} className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500">
                Add note
              </button>
            </div>
            <textarea
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              rows={5}
              placeholder="Capture meeting notes or client preferences..."
              className="mt-5 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-brand-500"
            />
            <div className="mt-6 space-y-4">
              {notes.length === 0 ? (
                <p className="text-sm text-slate-500">No notes yet. Capture your first call summary to keep this profile up to date.</p>
              ) : (
                notes.map((note) => <NoteCard key={note.id} message={note.message} createdAt={note.createdAt} />)
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-card">
            <h2 className="text-xl font-semibold text-slate-900">Top suggested matches</h2>
            <div className="mt-6 space-y-4">
              {topMatches.map(({ candidate, score }) => {
                const insight = getMatchInsights(customer, candidate);
                return (
                  <div key={candidate.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{candidate.firstName} {candidate.lastName}</p>
                        <p className="text-sm text-slate-600">{candidate.city} · {candidate.designation}</p>
                      </div>
                      <Badge label={`${score}%`} variant={score > 70 ? 'success' : score > 45 ? 'warning' : 'default'} />
                    </div>
                    <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                      <div>Values: {insight.values}%</div>
                      <div>Lifestyle: {insight.lifestyle}%</div>
                      <div>Career: {insight.career}%</div>
                      <div>Family: {insight.familyGoals}%</div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setSelectedMatch(candidate)}
                        className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
                      >
                        Send Match
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <SendMatchModal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        customer={customer}
        match={selectedMatch || customer}
        onConfirm={handleSendMatch}
      />

      <ToastContainer toasts={toasts} />
    </main>
  );
}
