'use client';

import { useState, useEffect } from 'react';
import { Save, RotateCcw, Eye } from 'lucide-react';

// These match the sections you can edit on the homepage
interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  imageUrl: string;
}

interface CategoryCard {
  id: string;
  label: string;
  imageUrl: string;
  link: string;
}

interface BannerReelItem {
  image: string;
  label: string;
  tagline: string;
}

interface HomepageContent {
  hero: HeroContent;
  categoryCards: CategoryCard[];
  bannerReel: BannerReelItem[];
  craftSectionTitle: string;
  craftSectionBody: string;
  marqueeText: string;
}

const DEFAULTS: HomepageContent = {
  hero: {
    headline: 'From Thread to Timeless Fashion.',
    subheadline: 'Scroll to uncover the story',
    ctaText: 'Discover Collection',
    imageUrl: '',  // hero uses a canvas frame animation, not a static image
  },
  categoryCards: [
    { id: 'dresses',  label: 'Dresses',   imageUrl: '/images/cat_dress.jpg',  link: '/products?category=Dresses' },
    { id: 'tops',     label: 'Tops',      imageUrl: '/images/cat_top.jpg',    link: '/products?category=Tops' },
    { id: 'coords',   label: 'Co-ords',   imageUrl: '/images/cat_coord.jpg',  link: '/products?category=Co-ords' },
  ],
  bannerReel: [
    { image: '/images/banner1.jpg', label: 'New Arrivals',  tagline: 'Freshly woven, just for you' },
    { image: '/images/banner2.jpg', label: 'Bestsellers',   tagline: 'Loved by our community'      },
    { image: '/images/banner3.jpg', label: 'Party Wear',    tagline: 'Make every occasion special'  },
  ],
  craftSectionTitle: 'Our Craft',
  craftSectionBody: 'Each piece is a story — of patience, of thread, of hands that have perfected this art over generations. We marry the ancient craft of Chikankari with silhouettes built for the modern woman.',
  marqueeText: 'Handcrafted with Love  ·  Ethical Fashion  ·  Artisan Made  ·  Sustainable Craft  ·',
};

const STORAGE_KEY = 'admin_homepage_content';

export default function AdminHomepagePage() {
  const [content, setContent] = useState<HomepageContent>(DEFAULTS);
  const [activeTab, setActiveTab] = useState<'hero' | 'categories' | 'banner' | 'craft'>('hero');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) try { setContent(JSON.parse(raw)); } catch {}
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const reset = () => {
    if (!confirm('Reset this section to defaults?')) return;
    setContent(DEFAULTS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const inputCls = 'w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400';
  const labelCls = 'block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2';

  const TABS = [
    { id: 'hero',       label: 'Hero Section' },
    { id: 'categories', label: 'Category Cards' },
    { id: 'banner',     label: 'Banner Reel' },
    { id: 'craft',      label: 'Craft Section' },
  ] as const;

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-serif text-gray-900">Homepage Content</h1>
          <p className="text-sm text-gray-500 mt-1">Edit what visitors see on the homepage. Changes take effect after saving.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={reset} className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm text-gray-600 rounded hover:bg-gray-50 transition">
            <RotateCcw size={14} /> Reset
          </button>
          <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm text-gray-600 rounded hover:bg-gray-50 transition">
            <Eye size={14} /> Preview Site
          </a>
          <button onClick={save} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition">
            <Save size={14} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Tab sidebar */}
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-0.5">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`w-full text-left px-4 py-3 text-sm rounded transition-colors ${activeTab === t.id ? 'bg-white border border-gray-200 shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-white'}`}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content panel */}
        <div className="flex-grow bg-white rounded-lg border border-gray-100 shadow-sm p-6">

          {/* ── Hero Section ── */}
          {activeTab === 'hero' && (
            <div className="space-y-5">
              <h2 className="font-semibold text-gray-900 mb-4">Hero Section</h2>
              <div>
                <label className={labelCls}>Headline</label>
                <textarea rows={2} value={content.hero.headline}
                  onChange={e => setContent(p => ({ ...p, hero: { ...p.hero, headline: e.target.value } }))}
                  className={inputCls + ' resize-none'} />
              </div>
              <div>
                <label className={labelCls}>Subheadline</label>
                <input type="text" value={content.hero.subheadline}
                  onChange={e => setContent(p => ({ ...p, hero: { ...p.hero, subheadline: e.target.value } }))}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>CTA Button Text</label>
                <input type="text" value={content.hero.ctaText}
                  onChange={e => setContent(p => ({ ...p, hero: { ...p.hero, ctaText: e.target.value } }))}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Hero Image URL / Path</label>
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded px-3 py-2 mb-3">
                  ℹ️ The homepage hero uses a <strong>scroll-driven frame animation</strong> (129 video frames), not a static image. Image URL here has no effect on the live site.
                </p>
                <input type="text" value={content.hero.imageUrl}
                  onChange={e => setContent(p => ({ ...p, hero: { ...p.hero, imageUrl: e.target.value } }))}
                  className={inputCls} placeholder="Not used — hero is a canvas animation" />
                {content.hero.imageUrl && (
                  <img src={content.hero.imageUrl} alt="Hero preview" className="mt-3 h-40 object-cover rounded border border-gray-100 w-full" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                )}
              </div>
            </div>
          )}

          {/* ── Category Cards ── */}
          {activeTab === 'categories' && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-6">Category Cards</h2>
              <div className="space-y-8">
                {content.categoryCards.map((card, idx) => (
                  <div key={card.id} className="border border-gray-100 rounded-lg p-5">
                    <p className="font-medium text-gray-700 text-sm mb-4 uppercase tracking-wider">{idx + 1}. {card.label}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Label</label>
                        <input type="text" value={card.label}
                          onChange={e => setContent(p => { const c = [...p.categoryCards]; c[idx] = { ...c[idx], label: e.target.value }; return { ...p, categoryCards: c }; })}
                          className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Link Path</label>
                        <input type="text" value={card.link}
                          onChange={e => setContent(p => { const c = [...p.categoryCards]; c[idx] = { ...c[idx], link: e.target.value }; return { ...p, categoryCards: c }; })}
                          className={inputCls} />
                      </div>
                      <div className="col-span-2">
                        <label className={labelCls}>Image URL / Path</label>
                        <input type="text" value={card.imageUrl}
                          onChange={e => setContent(p => { const c = [...p.categoryCards]; c[idx] = { ...c[idx], imageUrl: e.target.value }; return { ...p, categoryCards: c }; })}
                          className={inputCls} />
                        {card.imageUrl && <img src={card.imageUrl} alt="" className="mt-2 h-24 object-cover rounded border border-gray-100 w-full" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Banner Reel ── */}
          {activeTab === 'banner' && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-6">Banner Reel</h2>
              <div className="space-y-6">
                {content.bannerReel.map((item, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-lg p-5">
                    <p className="font-medium text-gray-700 text-sm mb-4">Banner {idx + 1}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Label</label>
                        <input type="text" value={item.label}
                          onChange={e => setContent(p => { const b = [...p.bannerReel]; b[idx] = { ...b[idx], label: e.target.value }; return { ...p, bannerReel: b }; })}
                          className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Tagline</label>
                        <input type="text" value={item.tagline}
                          onChange={e => setContent(p => { const b = [...p.bannerReel]; b[idx] = { ...b[idx], tagline: e.target.value }; return { ...p, bannerReel: b }; })}
                          className={inputCls} />
                      </div>
                      <div className="col-span-2">
                        <label className={labelCls}>Image URL / Path</label>
                        <input type="text" value={item.image}
                          onChange={e => setContent(p => { const b = [...p.bannerReel]; b[idx] = { ...b[idx], image: e.target.value }; return { ...p, bannerReel: b }; })}
                          className={inputCls} />
                        {item.image && <img src={item.image} alt="" className="mt-2 h-24 object-cover rounded border border-gray-100 w-full" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Craft Section ── */}
          {activeTab === 'craft' && (
            <div className="space-y-5">
              <h2 className="font-semibold text-gray-900 mb-4">Craft Section</h2>
              <div>
                <label className={labelCls}>Section Title</label>
                <input type="text" value={content.craftSectionTitle}
                  onChange={e => setContent(p => ({ ...p, craftSectionTitle: e.target.value }))}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Body Text</label>
                <textarea rows={5} value={content.craftSectionBody}
                  onChange={e => setContent(p => ({ ...p, craftSectionBody: e.target.value }))}
                  className={inputCls + ' resize-none'} />
              </div>
              <div>
                <label className={labelCls}>Marquee / Ticker Text</label>
                <input type="text" value={content.marqueeText}
                  onChange={e => setContent(p => ({ ...p, marqueeText: e.target.value }))}
                  className={inputCls} />
                <p className="text-xs text-gray-400 mt-1">Separate items with  ·  for the scrolling ticker.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
