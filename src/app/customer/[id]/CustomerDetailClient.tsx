'use client';

import { useMemo, useState } from 'react';
import { getTopMatches, getMatchInsights, getCompatibilityScore } from '@/lib/matching';
import { getCustomers } from '@/lib/customers';
import { getAvatarUrlSimple } from '@/lib/avatar';
import { Badge } from '@/components/badge';
import { ChatBox } from '@/components/chat-box';
import { SendMatchModal } from './send-match-modal';
import { useToast, ToastContainer } from '@/components/toast';
import { Customer } from '@/types/customer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CustomerDetailClientProps {
  customer: Customer;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1">
      <p className="text-xs uppercase tracking-[0.25em] text-brand-600 font-semibold">{label}</p>
      <p className="text-sm text-brand-900">{value}</p>
    </div>
  );
}

function NoteCard({ message, createdAt }: { message: string; createdAt: string }) {
  return (
    <div className="rounded-[16px] border border-brand-200/20 bg-brand-50 p-4">
      <p className="text-sm text-brand-900">{message}</p>
      <p className="mt-3 text-xs text-brand-600">{new Date(createdAt).toLocaleString()}</p>
    </div>
  );
}

function StarRating({ score }: { score: number }) {
  const stars = score >= 80 ? 5 : score >= 60 ? 4 : score >= 40 ? 3 : score >= 20 ? 2 : 1;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= stars ? 'text-yellow-400' : 'text-brand-200'}>
          ⭐
        </span>
      ))}
    </div>
  );
}

export function CustomerDetailClient({ customer }: CustomerDetailClientProps) {
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState(customer.notes ?? []);
  const [selectedMatch, setSelectedMatch] = useState<Customer | null>(null);
  const { toasts, showToast } = useToast();

  const topMatches = useMemo(() => getTopMatches(customer, getCustomers()), [customer]);
  const avatarUrl = getAvatarUrlSimple(customer.firstName, customer.gender);

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
    <>
      {/* Sticky Top Navigation */}
      <nav className="glass-navbar sticky top-0 z-30 border-b border-brand-200/20">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 transition font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </nav>

      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header with Avatar */}
          <div className="rounded-[16px] border border-brand-200/20 bg-white p-8 shadow-card">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-6 items-start">
                <img 
                  src={avatarUrl} 
                  alt={`${customer.firstName} ${customer.lastName}`}
                  className="h-24 w-24 rounded-full border-4 border-brand-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-600 font-semibold">Profile Details</p>
                  <h1 className="mt-2 text-4xl font-bold text-brand-900">{customer.firstName} {customer.lastName}</h1>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge label={customer.gender} />
                    <Badge label={customer.city} />
                    <Badge label={customer.status} variant={customer.status === 'Matched' ? 'success' : customer.status === 'In Progress' ? 'warning' : 'default'} />
                  </div>
                </div>
              </div>
              <div className="rounded-[16px] bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200 px-6 py-5 text-sm">
                <p><span className="font-semibold text-brand-900">Compatibility Score:</span> <span className="text-2xl font-bold text-brand-600">{compatibility}%</span></p>
                <p className="mt-2 text-xs text-brand-700">Based on values, lifestyle, career, & family alignment</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <section className="rounded-[16px] border border-brand-200/20 bg-brand-50 p-6">
                <h2 className="text-lg font-semibold text-brand-900">Personal</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <DetailRow label="Date of birth" value={new Date(customer.dob).toLocaleDateString()} />
                  <DetailRow label="Marital status" value={customer.maritalStatus} />
                  <DetailRow label="Country" value={customer.country} />
                  <DetailRow label="Languages" value={customer.languages.join(', ')} />
                  <DetailRow label="Family type" value={customer.familyType} />
                  <DetailRow label="Diet" value={customer.dietPreference} />
                </div>
              </section>

              <section className="rounded-[16px] border border-brand-200/20 bg-brand-50 p-6">
                <h2 className="text-lg font-semibold text-brand-900">Career</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <DetailRow label="Degree" value={customer.degree} />
                  <DetailRow label="College" value={customer.undergradCollege} />
                  <DetailRow label="Company" value={customer.company} />
                  <DetailRow label="Designation" value={customer.designation} />
                  <DetailRow label="Income" value={`₹${customer.income.toLocaleString()}`} />
                  <DetailRow label="Phone / Email" value={`${customer.phone} · ${customer.email}`} />
                </div>
              </section>

              <section className="rounded-[16px] border border-brand-200/20 bg-brand-50 p-6">
                <h2 className="text-lg font-semibold text-brand-900">Family / Values</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <DetailRow label="Religion" value={customer.religion} />
                  <DetailRow label="Caste" value={customer.caste} />
                  <DetailRow label="Manglik" value={customer.manglikStatus} />
                  <DetailRow label="Siblings" value={customer.siblings} />
                  <DetailRow label="Want kids" value={customer.wantKids ? 'Yes' : 'No'} />
                  <DetailRow label="Open to relocate" value={customer.openToRelocate ? 'Yes' : 'No'} />
                </div>
              </section>

              <section className="rounded-[16px] border border-brand-200/20 bg-brand-50 p-6">
                <h2 className="text-lg font-semibold text-brand-900">Preferences</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <DetailRow label="City preference" value={customer.city} />
                  <DetailRow label="Pets" value={customer.openToPets ? 'Open' : 'Not open'} />
                  <DetailRow label="Horoscope" value={customer.horoscopeSign} />
                  <DetailRow label="Lifestyle habits" value={customer.habits.join(', ')} />
                </div>
              </section>
            </div>
          </div>

          {/* Notes and Matches */}
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[16px] border border-brand-200/20 bg-white p-8 shadow-card">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-brand-900">📝 Notes</h2>
                <button 
                  onClick={handleAddNote} 
                  className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 text-white px-4 py-2 text-sm font-semibold transition hover:shadow-lg hover:scale-105"
                >
                  Add note
                </button>
              </div>
              <textarea
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                rows={5}
                placeholder="Capture meeting notes or client preferences..."
                className="w-full rounded-[12px] border border-brand-200 bg-white px-4 py-4 text-sm text-brand-900 placeholder-brand-500 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
              />
              <div className="mt-6 space-y-4">
                {notes.length === 0 ? (
                  <p className="text-sm text-brand-600">No notes yet. Capture your first call summary to keep this profile up to date.</p>
                ) : (
                  notes.map((note) => <NoteCard key={note.id} message={note.message} createdAt={note.createdAt} />)
                )}
              </div>
            </div>

            <div className="rounded-[16px] border border-brand-200/20 bg-white p-8 shadow-card">
              <h2 className="text-xl font-semibold text-brand-900 mb-6">💝 Top Matches</h2>
              <div className="space-y-4">
                {topMatches.map(({ candidate, score }) => {
                  const insight = getMatchInsights(customer, candidate);
                  const candidateAvatarUrl = getAvatarUrlSimple(candidate.firstName, candidate.gender);
                  return (
                    <div key={candidate.id} className="rounded-[16px] border border-brand-200/20 bg-gradient-to-br from-brand-50 to-brand-100 p-5 card-hover">
                      <div className="flex items-start gap-3 mb-3">
                        <img 
                          src={candidateAvatarUrl} 
                          alt={`${candidate.firstName} ${candidate.lastName}`}
                          className="h-12 w-12 rounded-full border-2 border-brand-300 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-brand-900">{candidate.firstName} {candidate.lastName}</p>
                          <p className="text-xs text-brand-700">{candidate.city} · {candidate.designation}</p>
                        </div>
                        <Badge label={`${score}%`} variant={score > 70 ? 'success' : score > 45 ? 'warning' : 'default'} />
                      </div>
                      
                      <div className="mb-3">
                        <StarRating score={score} />
                      </div>

                      <div className="grid gap-2 text-xs text-brand-700 sm:grid-cols-2">
                        <div>🎯 Values: {insight.values}%</div>
                        <div>🌟 Lifestyle: {insight.lifestyle}%</div>
                        <div>💼 Career: {insight.career}%</div>
                        <div>👨‍👩‍👧‍👦 Family: {insight.familyGoals}%</div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => setSelectedMatch(candidate)}
                          className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 text-white px-4 py-2 text-sm font-semibold transition hover:shadow-lg"
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
      </main>

      <SendMatchModal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        customer={customer}
        match={selectedMatch || customer}
        onConfirm={handleSendMatch}
      />

      <ToastContainer toasts={toasts} />
      <ChatBox />
    </>
  );
}
