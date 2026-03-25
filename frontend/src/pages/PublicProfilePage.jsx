import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../services/api';
import ListingCard from '../components/ListingCard';
import Rating from '../components/Rating';
import { FiCalendar, FiMapPin, FiMessageCircle, FiPackage } from 'react-icons/fi';

const PublicProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.getPublicProfile(id);
        setProfile(data.user);
        setListings(data.listings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1e' }}>
      <div style={{ width: '44px', height: '44px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!profile) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1e' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e2e8f0' }}>User not found</h2>
    </div>
  );

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', padding: 'clamp(24px,5vw,40px) 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px,4vw,24px)' }}>

        {/* Profile Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0d1b3e 0%, #1e1b4b 100%)',
          borderRadius: '24px',
          padding: 'clamp(24px,5vw,36px)',
          marginBottom: 'clamp(24px,4vw,32px)',
          border: '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 'clamp(150px,30vw,300px)', height: 'clamp(150px,30vw,300px)', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }} className="profile-layout">
            <div style={{ width: 'clamp(72px,15vw,96px)', height: 'clamp(72px,15vw,96px)', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 'clamp(1.6rem,5vw,2.2rem)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)', flexShrink: 0 }}>
              {profile.name?.charAt(0) || 'U'}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', fontWeight: 900, color: '#e2e8f0', margin: 0 }}>{profile.name}</h1>
              {profile.university && (
                <p style={{ color: 'rgba(148,163,184,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '6px', fontSize: '0.9rem' }}>
                  <FiMapPin size={13} /> {profile.university}
                </p>
              )}
              {profile.bio && <p style={{ color: 'rgba(148,163,184,0.8)', marginTop: '10px', maxWidth: '500px', lineHeight: 1.6, fontSize: 'clamp(0.875rem,2.5vw,1rem)' }}>{profile.bio}</p>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px,3vw,20px)', marginTop: '12px', flexWrap: 'wrap' }}>
                <Rating value={Math.round(profile.reputationScore / 20)} />
                <span style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.55)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiCalendar size={12} /> Joined {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Link
              to={`/chat/${profile._id}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                color: 'white', padding: '11px 24px', borderRadius: '9999px',
                fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
                boxShadow: '0 8px 24px rgba(99,102,241,0.4)', transition: 'all 0.2s', flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <FiMessageCircle size={16} /> Message
            </Link>
          </div>
        </div>

        {/* Listings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'clamp(16px,3vw,24px)' }}>
          <FiPackage style={{ color: '#60a5fa' }} size={20} />
          <h2 style={{ fontSize: 'clamp(1.2rem,3.5vw,1.5rem)', fontWeight: 800, color: '#e2e8f0', margin: 0 }}>
            Active Listings ({listings.length})
          </h2>
        </div>

        {listings.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '20px', padding: 'clamp(40px,8vw,60px)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📦</div>
            <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: '0.95rem' }}>No active listings from this seller.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: 'clamp(16px,3vw,24px)' }}>
            {listings.map((listing) => <ListingCard key={listing._id} listing={listing} />)}
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 640px) {
          .profile-layout { flex-direction: row !important; text-align: left !important; }
          .profile-layout .rating-wrapper { justify-content: flex-start !important; }
        }
      `}</style>
    </div>
  );
};
export default PublicProfilePage;
