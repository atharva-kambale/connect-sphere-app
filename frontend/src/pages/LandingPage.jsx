import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiMessageCircle, FiStar, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { getFeaturedListings } from '../services/api';

// ── 8 Categories with stickers ───────────────────────────────────────────────
export const CATEGORY_DATA = [
  {
    name: 'Academic & Educational',
    emoji: '📚',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.3)',
    bg: 'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.25)',
    desc: 'Textbooks, lab gear, art supplies & more',
  },
  {
    name: 'Electronics & Tech',
    emoji: '💻',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.3)',
    bg: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.25)',
    desc: 'Laptops, tablets, gaming, cameras & audio',
  },
  {
    name: 'Dorm & Housing',
    emoji: '🏠',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.3)',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.25)',
    desc: 'Furniture, appliances, storage & decor',
  },
  {
    name: 'Transportation',
    emoji: '🚲',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.3)',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.25)',
    desc: 'Bikes, scooters, boards & auto accessories',
  },
  {
    name: 'Apparel & Fashion',
    emoji: '👕',
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.3)',
    bg: 'rgba(236,72,153,0.12)',
    border: 'rgba(236,72,153,0.25)',
    desc: 'University merch, formal wear & costumes',
  },
  {
    name: 'Leisure & Fitness',
    emoji: '🎸',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.3)',
    bg: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.25)',
    desc: 'Sports gear, music, games & outdoor',
  },
  {
    name: 'Digital Goods',
    emoji: '🗂️',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.3)',
    bg: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.25)',
    desc: 'Notes, codes, presets & study aids',
  },
  {
    name: 'Tickets & Passes',
    emoji: '🎟️',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.3)',
    bg: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.25)',
    desc: 'Sports, events, concerts & gym passes',
  },
];

const categoryNames = CATEGORY_DATA.map(c => c.name);

const CATEGORY_EMOJI = {};
CATEGORY_DATA.forEach(c => { CATEGORY_EMOJI[c.name] = c.emoji; });

const stats = [
  { label: 'Active Students', value: '10K+', icon: FiUsers },
  { label: 'Items Listed', value: '50K+', icon: FiTrendingUp },
  { label: 'Trades Done', value: '25K+', icon: FiStar },
];

/* Desktop-only floating stickers */
const STICKERS = [
  { emoji: '📚', style: { top: '14%', left: '3%' }, delay: '0s', dur: '6s' },
  { emoji: '🎓', style: { top: '22%', right: '4%' }, delay: '1s', dur: '8s' },
  { emoji: '💡', style: { top: '64%', left: '5%' }, delay: '2s', dur: '7s' },
  { emoji: '🛒', style: { top: '68%', right: '5%' }, delay: '0.5s', dur: '9s' },
  { emoji: '⭐', style: { top: '40%', left: '1.5%' }, delay: '3s', dur: '5.5s' },
  { emoji: '🔔', style: { top: '44%', right: '2.5%' }, delay: '1.5s', dur: '7.5s' },
];

const TiltCard = ({ listing }) => {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const emoji = CATEGORY_EMOJI[listing.category] || '🏷️';
  const image = listing.images?.[0] || listing.image || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=60';

  const onMove = (e) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: dy * -8, y: dx * 8 });
  };

  return (
    <Link to={listing._id ? `/listing/${listing._id}` : '#'} style={{ textDecoration: 'none' }}>
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(() => setHovered(false), 300)}
      style={{
        transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovered ? '-6px' : '0'})`,
        transition: hovered ? 'transform 0.1s ease' : 'transform 0.4s ease',
        background: 'rgba(15,23,42,0.82)',
        borderRadius: '18px', overflow: 'hidden', cursor: 'pointer',
        border: hovered ? '1px solid rgba(96,165,250,0.3)' : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hovered ? '0 20px 48px rgba(59,130,246,0.25)' : '0 4px 16px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, fontSize: '1.8rem', transform: hovered ? 'scale(1.3) rotate(15deg)' : 'scale(1)', transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
        {emoji}
      </div>
      <div style={{ height: 'clamp(140px,25vw,185px)', overflow: 'hidden', position: 'relative' }}>
        <img src={image} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.6s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(10,15,30,0.65))' }} />
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(6px)', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
          ₹{listing.price}
        </div>
      </div>
      <div style={{ padding: 'clamp(12px,3vw,16px)' }}>
        <p style={{ fontSize: '0.65rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, margin: '0 0 4px' }}>{listing.category}</p>
        <h3 style={{ fontSize: 'clamp(0.85rem,2.5vw,0.95rem)', fontWeight: 700, color: hovered ? '#93c5fd' : '#e2e8f0', transition: 'color 0.2s', margin: 0 }}>{listing.title}</h3>
      </div>
    </motion.div>
    </Link>
  );
};

// Category card with sticker bounce on hover
const CategoryCard = ({ cat, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(() => setHovered(false), 300)}
    >
      <Link
        to={`/browse?category=${encodeURIComponent(cat.name)}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div style={{
          padding: 'clamp(16px,3vw,22px)',
          borderRadius: '18px',
          background: hovered ? cat.bg : 'rgba(255,255,255,0.04)',
          border: `1px solid ${hovered ? cat.border : 'rgba(255,255,255,0.08)'}`,
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          transition: 'all 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          transform: hovered ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
          boxShadow: hovered ? `0 16px 40px ${cat.glow}` : '0 2px 12px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }}>
          {/* Sticker / emoji */}
          <div style={{
            fontSize: 'clamp(2rem,5vw,2.8rem)',
            display: 'inline-block',
            transform: hovered ? 'scale(1.35) rotate(12deg)' : 'scale(1) rotate(0deg)',
            transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            marginBottom: '10px',
            filter: hovered ? `drop-shadow(0 0 8px ${cat.glow})` : 'none',
          }}>
            {cat.emoji}
          </div>
          <p style={{
            fontSize: 'clamp(0.75rem,2vw,0.88rem)',
            fontWeight: 700,
            color: hovered ? cat.color : '#e2e8f0',
            margin: '0 0 4px',
            transition: 'color 0.2s',
          }}>
            {cat.name}
          </p>
          <p style={{
            fontSize: 'clamp(0.62rem,1.6vw,0.73rem)',
            color: 'rgba(148,163,184,0.6)',
            margin: 0,
            lineHeight: 1.4,
            opacity: hovered ? 1 : 0.7,
            transition: 'opacity 0.2s',
          }}>
            {cat.desc}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

const LandingPage = () => {
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    getFeaturedListings()
      .then(res => setFeatured(res.data))
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));
  }, []);

  return (
  <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>

    {/* ── HERO ── */}
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #060b16 0%, #0f172a 45%, #1e1b4b 100%)',
      overflow: 'hidden',
      marginTop: '-68px',         // overlap behind fixed navbar
      paddingTop: '68px',
    }}>
      {/* bg texture */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=60" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.055 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,11,22,0.7) 0%, rgba(10,15,30,0.4) 60%, #0a0f1e 100%)' }} />
      </div>

      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '8%', right: '10%', width: 'clamp(180px,35vw,480px)', height: 'clamp(180px,35vw,480px)', background: 'radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', left: '5%', width: 'clamp(130px,25vw,340px)', height: 'clamp(130px,25vw,340px)', background: 'radial-gradient(circle, rgba(59,130,246,0.24) 0%, transparent 70%)', borderRadius: '50%', animation: 'blob2 10s ease-in-out infinite', pointerEvents: 'none' }} />

      {/* Floating stickers — desktop only */}
      <div className="lp-stickers">
        {STICKERS.map((s, i) => (
          <div key={i} style={{ position: 'absolute', ...s.style, fontSize: 'clamp(1.5rem,3vw,2.2rem)', opacity: 0.18, animation: `floatSticker ${s.dur} ease-in-out infinite ${s.delay}`, pointerEvents: 'none' }}>
            {s.emoji}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1280px', margin: '0 auto', padding: 'clamp(2.5rem,8vw,6rem) clamp(16px,5vw,40px) clamp(2rem,5vw,4rem)' }}>
        
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '9999px', padding: '6px 18px', fontSize: 'clamp(0.72rem,2.5vw,0.8rem)', color: '#93c5fd' }}>
            <span style={{ width: '7px', height: '7px', background: '#34d399', borderRadius: '50%', boxShadow: '0 0 8px #34d399', flexShrink: 0 }} />
            Trusted by 10,000+ university students
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ fontSize: 'clamp(2.2rem,9vw,5.5rem)', fontWeight: 900, lineHeight: 0.95, textAlign: 'center', marginBottom: '20px', letterSpacing: '-0.02em' }}>
          <span style={{ color: 'white' }}>Your Campus.<br /></span>
          <span style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite' }}>
            Your Marketplace.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center', fontSize: 'clamp(0.9rem,3vw,1.1rem)', color: 'rgba(203,213,225,0.8)', lineHeight: 1.65 }}>
          Buy, sell, and trade securely with verified students at your university. No shady meetups — just Connect Sphere.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ display: 'flex', gap: 'clamp(10px,3vw,14px)', justifyContent: 'center', marginTop: 'clamp(24px,5vw,36px)', flexWrap: 'wrap', padding: '0 4px' }}>
          <Link to="/browse" style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: 'clamp(11px,3vw,14px) clamp(18px,5vw,30px)', borderRadius: '9999px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: 'white', fontWeight: 700, fontSize: 'clamp(0.85rem,3vw,1rem)',
            textDecoration: 'none', boxShadow: '0 0 36px rgba(99,102,241,0.45)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 0 56px rgba(99,102,241,0.65)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(99,102,241,0.45)'; }}
          >
            Start Exploring <FiArrowRight />
          </Link>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: 'clamp(11px,3vw,14px) clamp(18px,5vw,30px)', borderRadius: '9999px',
            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: 'white', fontWeight: 700, fontSize: 'clamp(0.85rem,3vw,1rem)',
            textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            Sign Up Free
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(12px,4vw,24px)', maxWidth: '420px', margin: 'clamp(28px,6vw,48px) auto 0', textAlign: 'center' }}>
          {stats.map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: 'clamp(1.3rem,5vw,1.9rem)', fontWeight: 900, color: 'white', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 'clamp(0.62rem,2vw,0.72rem)', color: 'rgba(148,163,184,0.65)', marginTop: '4px', lineHeight: 1.3 }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── CATEGORIES ── */}
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(36px,7vw,72px) clamp(16px,5vw,40px)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 'clamp(22px,4vw,40px)' }}>
        <h2 style={{ fontSize: 'clamp(1.6rem,5vw,2.4rem)', fontWeight: 900, color: '#e2e8f0' }}>Explore Categories</h2>
        <p style={{ color: 'rgba(148,163,184,0.72)', marginTop: '8px', fontSize: 'clamp(0.88rem,2.5vw,1rem)' }}>Find exactly what you need from fellow students</p>
      </motion.div>

      {/* Category cards — 2 cols mobile, 4 cols desktop */}
      <div className="lp-cat-grid">
        {CATEGORY_DATA.map((cat, i) => (
          <CategoryCard key={cat.name} cat={cat} index={i} />
        ))}
      </div>

      {/* Featured Listings — real data from DB */}
      {!loadingFeatured && featured.length > 0 && (
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', margin: 'clamp(40px,7vw,72px) 0 clamp(20px,4vw,36px)' }}>
            <h2 style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', fontWeight: 900, color: '#e2e8f0' }}>Featured Listings</h2>
            <p style={{ color: 'rgba(148,163,184,0.72)', marginTop: '8px', fontSize: 'clamp(0.85rem,2.5vw,0.95rem)' }}>Fresh picks from your campus</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(10px,2.5vw,20px)' }} className="lp-cards">
            {featured.map((l) => <TiltCard key={l._id} listing={l} />)}
          </div>
        </>
      )}
      {loadingFeatured && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid rgba(99,102,241,0.25)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        </div>
      )}
    </section>

    {/* ── WHY US ── */}
    <section style={{ padding: 'clamp(40px,7vw,90px) 0', background: 'linear-gradient(135deg, #0d1b3e 0%, #1e1b4b 100%)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-64px', right: '-64px', width: 'clamp(140px,22vw,300px)', height: 'clamp(140px,22vw,300px)', background: 'radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-64px', left: '-64px', width: 'clamp(140px,22vw,300px)', height: 'clamp(140px,22vw,300px)', background: 'radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 70%)', borderRadius: '50%' }} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(16px,5vw,40px)', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 'clamp(24px,5vw,48px)' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem,5vw,2.4rem)', fontWeight: 900, color: 'white' }}>Why Connect Sphere?</h2>
          <p style={{ color: 'rgba(147,197,253,0.72)', marginTop: '8px', fontSize: 'clamp(0.88rem,2.5vw,1rem)' }}>Built by students, for students</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,240px),1fr))', gap: 'clamp(14px,3vw,22px)' }}>
          {[
            { icon: FiShield, title: 'University Only', desc: 'Only verified .edu email users can join — a safe, trusted community.', emoji: '🛡️' },
            { icon: FiMessageCircle, title: 'Instant Chat', desc: 'Negotiate safely with integrated real-time messaging.', emoji: '💬' },
            { icon: FiStar, title: 'Reputation System', desc: 'Build trust through student-run ratings and reviews.', emoji: '⭐' },
          ].map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.13 }} whileHover={{ scale: 1.02, y: -5 }}
              style={{ padding: 'clamp(20px,4vw,32px) clamp(18px,4vw,28px)', borderRadius: '22px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', transition: 'all 0.3s' }}>
              <div style={{ fontSize: 'clamp(1.8rem,5vw,2.4rem)', marginBottom: '12px' }}>{f.emoji}</div>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.18)' }}>
                <f.icon size={22} />
              </div>
              <h3 style={{ fontSize: 'clamp(0.95rem,3vw,1.15rem)', fontWeight: 700, color: 'white', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ color: 'rgba(186,230,253,0.68)', lineHeight: 1.65, fontSize: 'clamp(0.8rem,2vw,0.875rem)', margin: 0 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ── */}
    <section style={{ padding: 'clamp(44px,8vw,90px) clamp(16px,5vw,40px)', background: 'linear-gradient(135deg, #0a0f1e, #0f172a)' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ fontSize: 'clamp(2.4rem,7vw,3rem)', marginBottom: '14px' }}>🚀</div>
          <h2 style={{ fontSize: 'clamp(1.5rem,5vw,2.8rem)', fontWeight: 900, color: 'white', marginBottom: '16px' }}>Ready to join your campus marketplace?</h2>
          <p style={{ fontSize: 'clamp(0.88rem,2.5vw,1.05rem)', color: 'rgba(148,163,184,0.72)', marginBottom: 'clamp(24px,5vw,36px)' }}>Sign up takes less than 2 minutes.</p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: 'clamp(12px,3vw,15px) clamp(24px,6vw,36px)', borderRadius: '9999px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: 'white', fontWeight: 700, fontSize: 'clamp(0.88rem,3vw,1rem)',
            textDecoration: 'none', boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(99,102,241,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.35)'; }}
          >
            Get Started Free <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>

    <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
      @media (max-width: 640px) { .lp-stickers { display: none; } }
      @media (min-width: 768px)  { .lp-cards { grid-template-columns: repeat(4,1fr) !important; } }
      .lp-cat-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: clamp(10px, 2.5vw, 16px);
      }
      @media (min-width: 480px) { .lp-cat-grid { grid-template-columns: repeat(3, 1fr); } }
      @media (min-width: 768px) { .lp-cat-grid { grid-template-columns: repeat(4, 1fr); } }
    `}</style>
  </div>
  );
};
export default LandingPage;
