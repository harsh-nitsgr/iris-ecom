'use client';

import { useState } from 'react';

export default function DarkNewsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-[#0f0f0f] border-t border-white/10 py-28 px-4 md:px-16">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-white/30 text-xs tracking-[0.5em] uppercase mb-6">Stay in the loop</p>
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Be the first to know.</h2>
        <p className="text-white/40 font-light mb-12">New drops, exclusive stories, and early access — straight to your inbox.</p>

        {submitted ? (
          <p className="text-white/60 tracking-widest uppercase text-sm">Thank you. You're on the list.</p>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }}
            className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-transparent border border-white/20 text-white placeholder:text-white/30 px-6 py-4 text-sm outline-none focus:border-white/50 transition-colors"
            />
            <button
              type="submit"
              className="bg-white text-black px-8 py-4 text-xs tracking-widest uppercase font-medium hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
