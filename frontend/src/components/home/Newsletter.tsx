'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy submit
    alert(`Subscribed with ${email}`);
    setEmail('');
  };

  return (
    <section className="py-24 bg-white border-y border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-6">Join the Community</h2>
        <p className="text-gray-500 mb-10 text-lg font-light leading-relaxed">
          Subscribe to our newsletter and be the first to know about new collection drops, exclusive offers, and styling tips.
        </p>
        
        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          onSubmit={handleSubmit} 
          className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4"
        >
          <input 
            type="email" 
            required 
            placeholder="Enter your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow px-6 py-4 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors rounded-none placeholder-gray-400"
          />
          <button 
            type="submit" 
            className="bg-primary text-primary-foreground px-8 py-4 tracking-widest uppercase text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Subscribe
          </button>
        </motion.form>
      </div>
    </section>
  );
}
