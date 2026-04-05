'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { user, logout } = useAuthStore();

  // Close menus on route change
  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    setShowSearch(false);
  }, [pathname]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="fixed w-full top-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="focus:outline-none text-white transition"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-serif text-2xl font-bold tracking-wider text-white">
                IRIS
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link href="/products?category=Dresses" className="text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-widest">
                Dresses
              </Link>
              <Link href="/products?category=Co-ords" className="text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-widest">
                Co-ords
              </Link>
              <Link href="/products?category=Tops" className="text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-widest">
                Tops
              </Link>
              <Link href="/products" className="text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-widest">
                Shop All
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-6">
              <button onClick={() => setShowSearch(true)} className="text-white/80 hover:text-white transition hidden sm:block">
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* Auth button */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition"
                    aria-label="Account menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-white uppercase">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-xs tracking-widest uppercase hidden lg:block text-white/70">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  <div className="absolute right-0 mt-3 w-52 bg-[#111] border border-white/10 shadow-2xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white text-sm font-medium truncate">{user.name}</p>
                      <p className="text-white/40 text-xs truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm"
                    >
                      <User size={15} strokeWidth={1.5} /> My Account
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm"
                      >
                        <LayoutDashboard size={15} strokeWidth={1.5} /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-400/80 hover:text-red-400 hover:bg-white/5 transition-colors text-sm border-t border-white/10 mt-1"
                    >
                      <LogOut size={15} strokeWidth={1.5} /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="text-white/80 hover:text-white transition" aria-label="Sign in">
                  <User size={20} strokeWidth={1.5} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-b border-white/10">
            <div className="px-4 pt-2 pb-6 space-y-1">
              <button onClick={() => { setIsMenuOpen(false); setShowSearch(true); }} className="block w-full text-left px-3 py-3 text-sm font-medium text-white/70 hover:text-white border-b border-white/5 transition uppercase tracking-widest">
                Search
              </button>
              {['Dresses', 'Co-ords', 'Tops'].map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${cat}`}
                  className="block px-3 py-3 text-sm font-medium text-white/70 hover:text-white border-b border-white/5 transition uppercase tracking-widest"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat}
                </Link>
              ))}
              <Link
                href="/products"
                className="block px-3 py-3 text-sm font-medium text-white/70 hover:text-white border-b border-white/5 transition uppercase tracking-widest"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop All
              </Link>
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="block px-3 py-3 text-sm font-medium text-purple-400 hover:text-purple-300 border-b border-white/5 transition uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                  )}
                  <Link href="/profile" className="block px-3 py-3 text-sm font-medium text-white/70 hover:text-white border-b border-white/5 transition uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>My Account</Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-sm font-medium text-red-400 hover:text-red-300 transition uppercase tracking-widest">Sign Out</button>
                </>
              ) : (
                <Link href="/login" className="block px-3 py-3 text-sm text-white/70 hover:text-white transition" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Full Screen Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-start pt-32 px-4 transition-all">
          <button onClick={() => setShowSearch(false)} className="absolute top-8 right-8 p-2 text-white/50 hover:text-white transition-colors">
            <X size={36} strokeWidth={1} />
          </button>
          
          <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Search size={28} className="absolute left-0 top-1/2 -translate-y-1/2 text-white/50" strokeWidth={1} />
            <input 
              autoFocus
              type="text" 
              placeholder="Search the collection..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 text-white text-3xl sm:text-4xl font-serif py-4 pl-12 sm:pl-14 focus:outline-none focus:border-white transition-colors placeholder:text-white/20"
            />
          </form>
        </div>
      )}
    </>
  );
}
