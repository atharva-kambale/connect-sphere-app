import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as api from '../services/api';
import ListingCard from '../components/ListingCard';
import { FiSearch, FiX, FiSliders } from 'react-icons/fi';

const categories = ['All', 'Textbooks', 'Electronics', 'Dorm Essentials', 'Tutoring', 'Furniture'];

const SkeletonCard = () => (
  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
    <div style={{ height: 'clamp(140px,30vw,200px)', background: 'rgba(255,255,255,0.06)', animation: 'skPulse 1.4s ease-in-out infinite' }} />
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', width: '38%', animation: 'skPulse 1.4s ease-in-out infinite 0.1s' }} />
      <div style={{ height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', width: '72%', animation: 'skPulse 1.4s ease-in-out infinite 0.2s' }} />
      <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', width: '50%', animation: 'skPulse 1.4s ease-in-out infinite 0.3s' }} />
    </div>
  </div>
);

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) setActiveCategory(cat);
  }, [searchParams]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (search.trim()) params.search = search.trim();
      const { data } = await api.getListings(params);
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    const t = setTimeout(fetchListings, 350);
    return () => clearTimeout(t);
  }, [fetchListings]);

  const clearFilters = () => { setSearch(''); setActiveCategory('All'); };

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>

      {/* ── Search Header (scrolls with page) ── */}
      <div style={{
        background: 'rgba(8,13,28,0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(10px,2vw,14px) clamp(16px,4vw,24px)' }}>

          {/* Title + result count — desktop only */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h1 style={{ fontSize: 'clamp(1rem,3vw,1.3rem)', fontWeight: 800, color: '#e2e8f0', margin: 0 }}>
              Browse Listings
            </h1>
            {!loading && (
              <span style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.55)', fontWeight: 500 }}>
                {listings.length} {listings.length === 1 ? 'result' : 'results'}
                {activeCategory !== 'All' && ` · ${activeCategory}`}
              </span>
            )}
          </div>

          {/* Search bar — full width */}
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <FiSearch size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148,163,184,0.5)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search textbooks, electronics, dorm essentials…"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '11px 40px 11px 40px',
                color: '#f1f5f9',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.target.style.border = '1px solid rgba(96,165,250,0.45)'; e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.07)'; }}
              onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none'; }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(148,163,184,0.5)', display: 'flex', padding: '4px' }}>
                <FiX size={15} />
              </button>
            )}
          </div>

          {/* Category pills — scrollable */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                    background: active ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'rgba(255,255,255,0.07)',
                    color: active ? 'white' : 'rgba(148,163,184,0.8)',
                    boxShadow: active ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
                    transform: active ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(16px,3vw,28px) clamp(12px,3vw,24px)' }}>

        {/* Active filters badge */}
        {(search || activeCategory !== 'All') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {activeCategory !== 'All' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)', color: '#60a5fa', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600 }}>
                {activeCategory}
                <button onClick={() => setActiveCategory('All')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#60a5fa', display: 'flex', padding: 0 }}><FiX size={12} /></button>
              </span>
            )}
            {search && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)', color: '#60a5fa', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600 }}>
                "{search}"
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#60a5fa', display: 'flex', padding: 0 }}><FiX size={12} /></button>
              </span>
            )}
            <button onClick={clearFilters} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(148,163,184,0.6)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.78rem', cursor: 'pointer' }}>
              Clear all
            </button>
          </div>
        )}

        {loading ? (
          /* ── Skeleton grid — 2 cols mobile, 3 cols tablet, 4-5 cols desktop ── */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(10px,2vw,20px)' }} className="browse-grid">
            {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: 'clamp(48px,12vw,100px) 0' }}
          >
            <div style={{ fontSize: 'clamp(3.5rem,10vw,5rem)', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: 'clamp(1.1rem,4vw,1.5rem)', fontWeight: 700, color: '#e2e8f0', marginBottom: '10px' }}>No listings found</h3>
            <p style={{ color: 'rgba(148,163,184,0.65)', marginBottom: '28px', fontSize: 'clamp(0.875rem,2.5vw,1rem)' }}>
              Try a different search term or category
            </p>
            <button onClick={clearFilters} style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', padding: '12px 28px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
              Browse All Listings
            </button>
          </motion.div>
        ) : (
          /* ── 2-col mobile, auto-fill on Desktop ── */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'clamp(10px,2vw,20px)',
            }}
            className="browse-grid"
          >
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes skPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        /* On tablet+ expand to 3-4 cols */
        @media (min-width: 640px) {
          .browse-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .browse-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (min-width: 1280px) {
          .browse-grid { grid-template-columns: repeat(5, 1fr) !important; }
        }
        /* hide category scrollbar universally */
        div::-webkit-scrollbar { height: 0; width: 0; }
      `}</style>
    </div>
  );
};
export default HomePage;
