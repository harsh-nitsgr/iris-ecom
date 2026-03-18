'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, isLoading, error, user } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.push('/profile');
  }, [user, router]);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push('/profile');
    } catch {
      // error is stored in the auth store
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Left: editorial image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/products/prod8.jpg"
          alt="Login visual"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-16 z-10">
          <p className="text-white/30 text-xs tracking-[0.5em] uppercase mb-4">Welcome Back</p>
          <h2 className="text-4xl font-serif text-white mb-4 leading-tight">
            Dressed in<br />tradition.
          </h2>
          <p className="text-white/50 font-light max-w-xs text-sm leading-relaxed">
            Access your account, track your orders, and manage your wishlist.
          </p>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="max-w-md w-full">
          {/* Logo */}
          <Link href="/" className="block font-serif text-xl font-bold tracking-wider text-white mb-12 lg:hidden">
            CHICKENKARI
          </Link>

          <div className="mb-10">
            <p className="text-white/30 text-xs tracking-[0.5em] uppercase mb-3">Your Account</p>
            <h1 className="text-3xl font-serif text-white mb-2">Sign In</h1>
            <p className="text-white/40 font-light text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-white/80 hover:text-white underline underline-offset-4 transition-colors">
                Create one
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 border border-red-800 bg-red-950/50 text-red-400 text-sm rounded-none">
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

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-xs uppercase tracking-widest text-white/40">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-white/30 hover:text-white/60 underline underline-offset-4 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-white text-black px-8 py-4 text-xs font-medium tracking-widest uppercase hover:bg-white/90 transition-colors disabled:bg-white/30 disabled:text-black/40 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-12 text-center text-white/20 text-xs">
            By continuing, you agree to our{' '}
            <span className="text-white/40 underline cursor-pointer">Terms</span>{' '}
            and{' '}
            <span className="text-white/40 underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
