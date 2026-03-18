'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/users/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Back link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-widest uppercase mb-12 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        {sent ? (
          /* ── Success state ──────────────────────────────────────── */
          <div className="text-center">
            <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-8">
              <Mail size={22} className="text-white/60" />
            </div>
            <p className="text-white/30 text-xs tracking-[0.5em] uppercase mb-4">Check Your Inbox</p>
            <h1 className="text-3xl font-serif text-white mb-4">Email Sent</h1>
            <p className="text-white/40 font-light text-sm leading-relaxed mb-8">
              If <span className="text-white/70">{email}</span> is registered with us,
              you&apos;ll receive a password reset link within a few minutes.
            </p>
            <p className="text-white/20 text-xs">
              Didn&apos;t receive it?{' '}
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="text-white/40 underline underline-offset-4 hover:text-white/60 transition-colors"
              >
                Try again
              </button>
            </p>
          </div>
        ) : (
          /* ── Request form ───────────────────────────────────────── */
          <>
            <p className="text-white/30 text-xs tracking-[0.5em] uppercase mb-3">Account Recovery</p>
            <h1 className="text-3xl font-serif text-white mb-3">Forgot Password?</h1>
            <p className="text-white/40 font-light text-sm mb-10 leading-relaxed">
              Enter the email address linked to your account and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 border border-red-800 bg-red-950/50 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent border border-white/15 text-white placeholder:text-white/20 px-4 py-3.5 text-sm focus:border-white/50 outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black px-8 py-4 text-xs font-medium tracking-widest uppercase hover:bg-white/90 transition-colors disabled:bg-white/30 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
