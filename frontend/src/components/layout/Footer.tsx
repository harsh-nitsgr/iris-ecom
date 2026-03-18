import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="font-serif text-2xl font-bold tracking-wider mb-6 block">
              IRIS
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
              Western fashion tailored for the Indian vibe. Premium quality, modern silhouettes, and a touch of indigenous artistry.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/products?category=New" className="text-gray-400 hover:text-white transition text-sm">New Arrivals</Link></li>
              <li><Link href="/products?category=Dresses" className="text-gray-400 hover:text-white transition text-sm">Dresses</Link></li>
              <li><Link href="/products?category=Co-ords" className="text-gray-400 hover:text-white transition text-sm">Co-ords</Link></li>
              <li><Link href="/products?category=Sale" className="text-gray-400 hover:text-white transition text-sm">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition text-sm">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-white transition text-sm">Shipping Policy</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-white transition text-sm">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition text-sm">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-6">About</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition text-sm">Our Story</Link></li>
              <li><Link href="/brands" className="text-gray-400 hover:text-white transition text-sm">Featured Brands</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition text-sm">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Iris. All rights reserved.
          </p>
          <div className="flex space-x-4">
            {/* Mock payment methods */}
            <span className="text-gray-500 text-xs font-semibold tracking-widest">VISA</span>
            <span className="text-gray-500 text-xs font-semibold tracking-widest">MASTERCARD</span>
            <span className="text-gray-500 text-xs font-semibold tracking-widest">UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
