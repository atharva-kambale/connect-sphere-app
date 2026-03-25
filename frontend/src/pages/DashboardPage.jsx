import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as api from '../services/api';
import ListingCard from '../components/ListingCard';
import { FiPlus, FiPackage, FiStar, FiEdit, FiCamera } from 'react-icons/fi';

const DashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.getUserProfile();
        setProfile(data.user);
        setListings(data.listings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateListingStatus(id, status);
      setListings(listings.map(l => l._id === id ? { ...l, status } : l));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1e' }}>
      <div style={{ width: '44px', height: '44px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', padding: 'clamp(24px,5vw,40px) 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(16px,4vw,24px)' }}>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #1d4ed8 0%, #1e1b4b 100%)',
            borderRadius: '24px',
            padding: 'clamp(24px,5vw,36px)',
            marginBottom: 'clamp(24px,4vw,32px)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 'clamp(150px,30vw,300px)', height: 'clamp(150px,30vw,300px)', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(40px)' }} />
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 'clamp(16px,3vw,24px)', flexWrap: 'wrap' }} className="dash-header">
            
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  style={{
                    width: 'clamp(72px,15vw,96px)',
                    height: 'clamp(72px,15vw,96px)',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid rgba(255,255,255,0.25)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  }}
                />
              ) : (
                <div style={{
                  width: 'clamp(72px,15vw,96px)',
                  height: 'clamp(72px,15vw,96px)',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(12px)',
                  border: '3px solid rgba(255,255,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'clamp(2rem,5vw,2.5rem)',
                  fontWeight: 900,
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}>
                  {profile?.name?.charAt(0) || 'U'}
                </div>
              )}
              <Link
                to="/settings"
                title="Change photo"
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'transform 0.2s',
                }}
              >
                <FiCamera size={13} />
              </Link>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: '180px' }}>
              <h1 style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', fontWeight: 900, color: 'white', margin: 0 }}>{profile?.name}</h1>
              <p style={{ color: 'rgba(186,230,253,0.75)', margin: '4px 0 0', fontSize: 'clamp(0.85rem,2.5vw,1rem)' }}>{profile?.university || profile?.campus || 'Student'}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.15)', padding: '5px 14px', borderRadius: '9999px', fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>
                  <FiStar size={13} /> {profile?.reputationScore || 0} Rep
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.15)', padding: '5px 14px', borderRadius: '9999px', fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>
                  <FiPackage size={13} /> {listings.length} Listings
                </span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Link
              to="/settings"
              style={{
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)', padding: '10px 22px',
                borderRadius: '9999px', fontWeight: 600, color: 'white',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '0.875rem', transition: 'all 0.2s',
                alignSelf: 'flex-start',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              <FiEdit size={15} /> Edit Profile
            </Link>
          </div>
        </motion.div>

        {/* My Listings */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(16px,3vw,24px)', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: 'clamp(1.3rem,4vw,1.75rem)', fontWeight: 800, color: '#e2e8f0', margin: 0 }}>My Listings</h2>
          <Link
            to="/create-listing"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: 'white', padding: '10px 20px', borderRadius: '9999px',
              fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.875rem', boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <FiPlus size={15} /> New Listing
          </Link>
        </div>

        {listings.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '24px', padding: 'clamp(40px,8vw,60px)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 'clamp(3rem,8vw,4rem)', marginBottom: '16px' }}>📦</div>
            <h3 style={{ fontSize: 'clamp(1.1rem,3.5vw,1.4rem)', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>No listings yet</h3>
            <p style={{ color: 'rgba(148,163,184,0.7)', marginBottom: '24px', fontSize: 'clamp(0.875rem,2.5vw,1rem)' }}>Start selling to your campus community!</p>
            <Link
              to="/create-listing"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                color: 'white', padding: '12px 28px', borderRadius: '9999px',
                fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem',
              }}
            >
              <FiPlus size={16} /> Create First Listing
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: 'clamp(16px,3vw,24px)' }}>
            {listings.map((listing) => (
              <div key={listing._id} style={{ position: 'relative' }}>
                <ListingCard listing={listing} />
                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', opacity: 0, transition: 'opacity 0.2s' }}
                  className="listing-actions">
                  <Link to={`/edit-listing/${listing._id}`} style={{ background: 'rgba(10,15,30,0.9)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', textDecoration: 'none', border: '1px solid rgba(96,165,250,0.3)' }}>Edit</Link>
                  {listing.status === 'Active' && <button onClick={() => handleStatusChange(listing._id, 'Sold')} style={{ background: 'rgba(10,15,30,0.9)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', cursor: 'pointer' }}>Mark Sold</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 639px) {
          .dash-header { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          .dash-header > a:last-child { align-self: center !important; }
          .dash-header > div:nth-child(2) { display: flex; flex-direction: column; align-items: center; }
          .dash-header > div:nth-child(2) > div:last-child { justify-content: center; }
        }
        .listing-actions { opacity: 0; }
        .listing-actions:hover, *:hover > .listing-actions { opacity: 1 !important; }
      `}</style>
    </div>
  );
};
export default DashboardPage;
