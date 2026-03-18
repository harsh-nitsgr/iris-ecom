'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutDashboard, ShoppingBag, Users, Home, LogOut, TrendingUp, Image } from 'lucide-react';

const NAV = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: ShoppingBag,     label: 'Products' },
  { href: '/admin/homepage', icon: Image,           label: 'Homepage' },
  { href: '/admin/interests',icon: TrendingUp,      label: 'Interest Data' },
  { href: '/admin/users',    icon: Users,           label: 'Users' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;  // wait for hydration
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router, mounted]);

  // Show nothing until hydrated to avoid flash of wrong redirect
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-white/40 text-sm tracking-widest uppercase">Loading…</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-white/40 text-sm tracking-widest uppercase">Checking access…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0f0f0f] flex-shrink-0 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="font-serif text-lg font-bold tracking-[0.3em] text-white">ADMIN</span>
          <span className="ml-2 text-white/20 text-xs tracking-widest uppercase">Portal</span>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-0.5">
          {NAV.map(({ href, icon: Icon, label }) => {
            const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`flex items-center px-4 py-3 text-sm rounded transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                <Icon size={16} className="mr-3 flex-shrink-0" strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link href="/" className="flex items-center px-4 py-3 text-sm text-white/30 hover:text-white transition-colors">
            <Home size={16} className="mr-3" strokeWidth={1.5} /> View Site
          </Link>
          <button onClick={() => { logout(); router.push('/'); }}
            className="flex w-full items-center px-4 py-3 text-sm text-red-400/60 hover:text-red-400 hover:bg-red-950/20 rounded transition">
            <LogOut size={16} className="mr-3" strokeWidth={1.5} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
