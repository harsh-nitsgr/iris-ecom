'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.put(`/users/reset-password/${token}`, { password });
      // Auto-login the user after successful reset
      if (data.token) {
        // Manually set auth store state (bypass the login API call)
        useAuthStore.setState({ user: data, token: data.token });
      }
      setDone(true);
      setTimeout(() => router.push('/profile'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle size={48} className="text-green-400 mx-auto mb-6" strokeWidth={1} />
          <p className="text-white/30 text-xs tracking-[0.5em] uppercase mb-3">Success</p>
          <h1 className="text-3xl font-serif text-white mb-4">Password Updated</h1>
          <p className="text-white/40 text-sm">Redirecting you to your account…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-widest uppercase mb-12 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        <p className="text-white/30 text-xs tracking-[0.5em] uppercase mb-3">Account Recovery</p>
        <h1 className="text-3xl font-serif text-white mb-3">New Password</h1>
        <p className="text-white/40 font-light text-sm mb-10 leading-relaxed">
          Choose a strong new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 border border-red-800 bg-red-950/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full bg-transparent border border-white/15 text-white placeholder:text-white/20 px-4 py-3.5 pr-12 text-sm focus:border-white/50 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full bg-transparent border border-white/15 text-white placeholder:text-white/20 px-4 py-3.5 text-sm focus:border-white/50 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black px-8 py-4 text-xs font-medium tracking-widest uppercase hover:bg-white/90 transition-colors disabled:bg-white/30 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating Password...' : 'Set New Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
