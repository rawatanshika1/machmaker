'use client';

import { useState, useEffect } from 'react';
import { Customer } from '@/types/customer';
import { getAvatarUrlSimple } from '@/lib/avatar';
import { X } from 'lucide-react';

interface SendMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  match: Customer;
  onConfirm: () => void;
}

export function SendMatchModal({ isOpen, onClose, customer, match, onConfirm }: SendMatchModalProps) {
  const [intro, setIntro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && !intro) {
      generateIntro();
    }
  }, [isOpen]);

  const generateIntro = async () => {
    // Client-side deterministic intro generation (no external API)
    setLoading(true);
    try {
      const matchName = `${match.firstName} ${match.lastName}`;
      const matchRole = match.designation || match.company || 'professional';
      const parts: string[] = [];

      parts.push(`We'd like to introduce you to ${matchName}, a ${matchRole} based in ${match.city || 'their city'}.`);

      const sharedValues = customer.religion || customer.familyType || match.religion || match.familyType;
      if (sharedValues) {
        parts.push(`With shared values around ${sharedValues} and complementary career backgrounds, we believe this could be a meaningful connection.`);
      } else {
        parts.push('They have complementary backgrounds that suggest a meaningful connection.');
      }

      const relocation = match.openToRelocate ? 'open to relocation' : 'not open to relocation';
      const kids = typeof match.wantKids === 'boolean' ? (match.wantKids ? 'wants kids' : "doesn't want kids") : 'has unspecified preferences on kids';
      parts.push(`${match.firstName} is ${relocation} and ${kids} — aligning well with your preferences.`);

      setIntro(parts.join(' '));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const customerAvatarUrl = getAvatarUrlSimple(customer.firstName, customer.gender);
  const matchAvatarUrl = getAvatarUrlSimple(match.firstName, match.gender);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-[16px] border border-brand-200/20 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-brand-100 bg-gradient-to-r from-brand-50 to-brand-100 p-6">
            <h2 className="text-xl font-semibold text-brand-900">💝 Send Match</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-brand-600 hover:bg-brand-200 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6 p-6">
            {/* From Customer */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-brand-600 font-semibold">From</p>
              <div className="flex items-center gap-3">
                <img 
                  src={customerAvatarUrl} 
                  alt={`${customer.firstName} ${customer.lastName}`}
                  className="h-12 w-12 rounded-full border-2 border-brand-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div>
                  <p className="font-semibold text-brand-900">{customer.firstName} {customer.lastName}</p>
                  <p className="text-sm text-brand-700">{customer.city}</p>
                </div>
              </div>
            </div>

            {/* To Match */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-brand-600 font-semibold">To</p>
              <div className="flex items-center gap-3">
                <img 
                  src={matchAvatarUrl} 
                  alt={`${match.firstName} ${match.lastName}`}
                  className="h-12 w-12 rounded-full border-2 border-brand-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div>
                  <p className="font-semibold text-brand-900">{match.firstName} {match.lastName}</p>
                  <p className="text-sm text-brand-700">{match.designation} · {match.city}</p>
                </div>
              </div>
            </div>

            {/* Introduction */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-brand-600 font-semibold">Introduction</p>
              {loading ? (
                <div className="rounded-[12px] bg-brand-50 p-4">
                  <p className="text-sm text-brand-600">✨ Generating personalized introduction...</p>
                </div>
              ) : error ? (
                <div className="rounded-[12px] bg-red-50 p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              ) : (
                <div className="rounded-[12px] bg-brand-50 p-4 border border-brand-100">
                  <p className="text-sm leading-relaxed text-brand-900">{intro}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-brand-100 p-6 bg-brand-50">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-brand-300 bg-white text-brand-900 px-4 py-2 text-sm font-semibold transition hover:bg-brand-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || !!error}
              className="flex-1 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 text-white px-4 py-2 text-sm font-semibold transition hover:shadow-lg disabled:cursor-not-allowed disabled:bg-brand-300"
            >
              Confirm & Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
