import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Category emoji lookup — matches the 8 categories
const CATEGORY_EMOJI = {
  'Academic & Educational': '📚',
  'Electronics & Tech': '💻',
  'Dorm & Housing': '🏠',
  'Transportation': '🚲',
  'Apparel & Fashion': '👕',
  'Leisure & Fitness': '🎸',
  'Digital Goods': '🗂️',
  'Tickets & Passes': '🎟️',
  // Legacy fallbacks
  'Textbooks': '📚',
  'Electronics': '💻',
  'Dorm Essentials': '🏠',
  'Tutoring': '✏️',
  'Furniture': '🪑',
};

const CATEGORY_COLOR = {
  'Academic & Educational': '#6366f1',
  'Electronics & Tech': '#3b82f6',
  'Dorm & Housing': '#10b981',
  'Transportation': '#f59e0b',
  'Apparel & Fashion': '#ec4899',
  'Leisure & Fitness': '#8b5cf6',
  'Digital Goods': '#06b6d4',
  'Tickets & Passes': '#f97316',
};

const ListingCard = ({ listing }) => {
  const [hovered, setHovered] = useState(false);
  const [stickerAnim, setStickerAnim] = useState(false);
  const emoji = CATEGORY_EMOJI[listing.category] || '🏷️';
  const accentColor = CATEGORY_COLOR[listing.category] || '#60a5fa';

  const handleEnter = () => {
    setHovered(true);
    setStickerAnim(true);
  };
  const handleLeave = () => {
    setHovered(false);
    setStickerAnim(false);
  };

  return (
    <Link to={`/listing/${listing._id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onTouchStart={handleEnter}
        onTouchEnd={() => setTimeout(handleLeave, 250)}
        style={{
          background: 'rgba(15,23,42,0.85)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: `1px solid ${hovered ? `${accentColor}55` : 'rgba(255,255,255,0.07)'}`,
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: hovered
            ? `0 14px 40px ${accentColor}33`
            : '0 2px 12px rgba(0,0,0,0.25)',
          transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
          transition: 'all 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          willChange: 'transform',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', paddingTop: '68%', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={listing.images?.[0] || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=60'}
            alt={listing.title}
            loading="lazy"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hovered ? 'scale(1.07)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />
          {/* gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(10,15,30,0.55))' }} />

          {/* ── Category sticker (top-left) ── */}
          <div style={{
            position: 'absolute', top: '8px', left: '8px',
            fontSize: 'clamp(1.3rem,4vw,1.7rem)',
            transform: stickerAnim ? 'scale(1.4) rotate(14deg)' : 'scale(1) rotate(0deg)',
            transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            filter: stickerAnim ? `drop-shadow(0 0 6px ${accentColor})` : 'none',
            lineHeight: 1,
            zIndex: 2,
          }}>
            {emoji}
          </div>

          {/* Price badge */}
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            background: 'rgba(6,11,22,0.88)', backdropFilter: 'blur(8px)',
            padding: '3px 9px', borderRadius: '9999px',
            fontSize: 'clamp(0.65rem, 2vw, 0.8rem)', fontWeight: 700, color: '#60a5fa',
            border: '1px solid rgba(96,165,250,0.2)',
          }}>
            ₹{listing.price}
          </div>
          {listing.status === 'Sold' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
              <span style={{ background: '#ef4444', color: 'white', padding: '3px 12px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.75rem' }}>SOLD</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: 'clamp(10px, 2.5vw, 14px)', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{
            fontSize: 'clamp(0.6rem, 1.8vw, 0.68rem)',
            color: accentColor,
            textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, margin: 0,
            transition: 'color 0.2s',
          }}>
            {listing.category}
          </p>
          <h3 style={{ fontSize: 'clamp(0.78rem, 2.5vw, 0.95rem)', fontWeight: 700, color: hovered ? '#93c5fd' : '#e2e8f0', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', transition: 'color 0.2s' }}>
            {listing.title}
          </h3>
          {/* Seller */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }} className="card-seller">
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '0.6rem', fontWeight: 700, flexShrink: 0,
            }}>
              {listing.seller?.name?.charAt(0) || 'U'}
            </div>
            <span style={{ fontSize: 'clamp(0.65rem, 2vw, 0.78rem)', color: 'rgba(148,163,184,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {listing.seller?.name || 'Student'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default ListingCard;
