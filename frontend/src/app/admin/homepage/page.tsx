'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, RotateCcw, Eye, ImagePlus, Loader2, X } from 'lucide-react';
import api from '@/lib/api';

interface HeroContent      { headline: string; subheadline: string; ctaText: string; imageUrl: string; }
interface CategoryCard     { id: string; label: string; imageUrl: string; link: string; }
interface BannerReelItem   { image: string; label: string; tagline: string; }
interface HomepageContent  {
  hero: HeroContent;
  categoryCards: CategoryCard[];
  bannerReel: BannerReelItem[];
  craftSectionTitle: string;
  craftSectionBody: string;
  marqueeText: string;
}

const DEFAULTS: HomepageContent = {
  hero: { headline: 'From Thread to Timeless Fashion.', subheadline: 'Scroll to uncover the story', ctaText: 'Discover Collection', imageUrl: '' },
  categoryCards: [
    { id: 'dresses', label: 'Dresses',  imageUrl: '', link: '/products?category=Dresses' },
    { id: 'tops',    label: 'Tops',     imageUrl: '', link: '/products?category=Tops'    },
    { id: 'coords',  label: 'Co-ords',  imageUrl: '', link: '/products?category=Co-ords' },
  ],
  bannerReel: [
    { image: '', label: 'New Arrivals', tagline: 'Freshly woven, just for you' },
    { image: '', label: 'Bestsellers',  tagline: 'Loved by our community'      },
    { image: '', label: 'Party Wear',   tagline: 'Make every occasion special'  },
  ],
  craftSectionTitle: 'Our Craft',
  craftSectionBody: 'Each piece is a story — of patience, of thread, of hands that have perfected this art over generations.',
  marqueeText: 'Handcrafted with Love  ·  Ethical Fashion  ·  Artisan Made  ·  Sustainable Craft  ·',
};

const STORAGE_KEY = 'admin_homepage_content';

// ── Reusable single-image upload dropzone ─────────────────────────────────
function ImageUpload({ value, onChange, label }: { value: string; onChange: (url: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(data.url);
    } catch { alert('Upload failed — check your internet and try again.'); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">{label}</label>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) upload(e.dataTransfer.files[0]); }}
        onClick={() => ref.current?.click()}
        className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${dragOver ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`}
      >
        <input ref={ref} type="file" accept="image/*" className="hidden"
          onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />

        {value ? (
          <div className="relative group">
            <img src={value} alt="" className="w-full h-36 object-cover rounded-md" />
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onChange(''); }}
              className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-500"
            >
              <X size={12} />
            </button>
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition rounded-md flex items-center justify-center">
              <p className="text-white text-xs font-medium">Click to replace</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            {uploading
              ? <><Loader2 size={22} className="text-gray-400 animate-spin" /><p className="text-sm text-gray-500">Uploading…</p></>
              : <><ImagePlus size={22} className="text-gray-400" /><p className="text-sm text-gray-700 font-medium">Click or drag image here</p><p className="text-xs text-gray-400">PNG, JPG, WEBP</p></>
            }
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
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
    if (!confirm('Reset all homepage content to defaults?')) return;
    setContent(DEFAULTS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const inputCls = 'w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400';
  const labelCls = 'block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2';

  const TABS = [
    { id: 'hero',       label: 'Hero Section'    },
    { id: 'categories', label: 'Category Cards'  },
    { id: 'banner',     label: 'Banner Reel'     },
    { id: 'craft',      label: 'Craft Section'   },
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
                className={`w-full text-left px-4 py-3 text-sm rounded transition-colors
                  ${activeTab === t.id ? 'bg-white border border-gray-200 shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-white'}`}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content panel */}
        <div className="flex-grow bg-white rounded-lg border border-gray-100 shadow-sm p-6">

          {/* ── Hero ── */}
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
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded px-3 py-2">
                ℹ️ The homepage hero uses a <strong>scroll-driven frame animation</strong>. The image below is not used on the live site — it&apos;s background reference only.
              </p>
              <ImageUpload
                label="Hero Background Image (reference only)"
                value={content.hero.imageUrl}
                onChange={url => setContent(p => ({ ...p, hero: { ...p.hero, imageUrl: url } }))}
              />
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
                    <div className="grid grid-cols-2 gap-4 mb-4">
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
                    </div>
                    <ImageUpload
                      label="Category Image"
                      value={card.imageUrl}
                      onChange={url => setContent(p => { const c = [...p.categoryCards]; c[idx] = { ...c[idx], imageUrl: url }; return { ...p, categoryCards: c }; })}
                    />
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
                    <div className="grid grid-cols-2 gap-4 mb-4">
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
                    </div>
                    <ImageUpload
                      label="Banner Image"
                      value={item.image}
                      onChange={url => setContent(p => { const b = [...p.bannerReel]; b[idx] = { ...b[idx], image: url }; return { ...p, bannerReel: b }; })}
                    />
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
