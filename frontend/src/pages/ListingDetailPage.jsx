import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import * as api from '../services/api';
import { FiMessageCircle, FiMapPin, FiClock, FiChevronLeft, FiChevronRight, FiArrowLeft, FiStar, FiX } from 'react-icons/fi';

// ── Review Modal ──────────────────────────────────────────────────────────────
const ReviewModal = ({ sellerId, sellerName, listingId, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setError('Please select a rating');
    setLoading(true);
    setError('');
    try {
      await api.createReview({ reviewee: sellerId, listing: listingId, rating, comment });
      onSubmit();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '24px', padding: 'clamp(24px,5vw,36px)', width: '100%', maxWidth: '440px',
          backdropFilter: 'blur(24px)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e2e8f0', margin: 0 }}>Rate {sellerName}</h2>
            <p style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.6)', margin: '4px 0 0' }}>Share your experience</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'rgba(148,163,184,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiX size={18} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.7)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Your Rating</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'transform 0.15s' }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <FiStar
                    size={32}
                    style={{
                      color: (hoverRating || rating) >= star ? '#fbbf24' : 'rgba(255,255,255,0.15)',
                      fill: (hoverRating || rating) >= star ? '#fbbf24' : 'transparent',
                      transition: 'all 0.15s',
                      filter: (hoverRating || rating) >= star ? 'drop-shadow(0 0 6px rgba(251,191,36,0.5))' : 'none',
                    }}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p style={{ fontSize: '0.85rem', color: '#fbbf24', marginTop: '6px', fontWeight: 600 }}>
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'rgba(148,163,184,0.9)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              placeholder="Tell others about your experience with this seller..."
              style={{
                width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '12px 16px', color: '#f1f5f9', fontSize: '0.9rem',
                outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'all 0.2s',
              }}
              onFocus={e => { e.target.style.border = '1px solid rgba(96,165,250,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.08)'; }}
              onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || rating === 0}
            style={{
              width: '100%', padding: '13px', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem',
              color: 'white', border: 'none', cursor: (loading || rating === 0) ? 'not-allowed' : 'pointer',
              background: (loading || rating === 0) ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
              boxShadow: (loading || rating === 0) ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// ── Star display helper ───────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map(s => (
      <FiStar key={s} size={13} style={{ color: rating >= s ? '#fbbf24' : 'rgba(255,255,255,0.15)', fill: rating >= s ? '#fbbf24' : 'transparent' }} />
    ))}
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ avgRating: 0, totalReviews: 0 });
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await api.getListingById(id);
        setListing(data);
        if (data.seller?._id) {
          const reviewRes = await api.getReviewsForUser(data.seller._id);
          setReviews(reviewRes.data.reviews || []);
          setReviewStats({ avgRating: reviewRes.data.avgRating || 0, totalReviews: reviewRes.data.totalReviews || 0 });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleReviewSubmitted = async () => {
    if (listing?.seller?._id) {
      const reviewRes = await api.getReviewsForUser(listing.seller._id);
      setReviews(reviewRes.data.reviews || []);
      setReviewStats({ avgRating: reviewRes.data.avgRating || 0, totalReviews: reviewRes.data.totalReviews || 0 });
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1e' }}>
      <div style={{ width: '44px', height: '44px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!listing) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1e', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '4rem' }}>🔍</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e2e8f0' }}>Listing not found</h2>
      <Link to="/browse" style={{ color: '#60a5fa', textDecoration: 'none' }}>Browse listings →</Link>
    </div>
  );

  const images = listing.images?.length > 0 ? listing.images : ['https://images.unsplash.com/photo-1557683316-973673baf926?w=800'];
  const sc = listing.status === 'Active'
    ? { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.25)' }
    : listing.status === 'Sold'
      ? { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)' }
      : { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: 'rgba(148,163,184,0.25)' };

  const isSeller = user?._id === listing.seller?._id;

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', padding: 'clamp(20px,4vw,32px) 0' }}>
      {showReviewModal && (
        <ReviewModal
          sellerId={listing.seller?._id}
          sellerName={listing.seller?.name}
          listingId={id}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmitted}
        />
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px,4vw,24px)' }}>
        <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(148,163,184,0.7)', textDecoration: 'none', marginBottom: 'clamp(16px,3vw,24px)', fontSize: '0.9rem', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,0.7)'}
        >
          <FiArrowLeft size={16} /> Back to listings
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(20px,4vw,32px)', alignItems: 'start' }}>

          {/* Image Gallery */}
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/3', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <img src={images[activeImage]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImage(i => i > 0 ? i - 1 : images.length - 1)} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(10,15,30,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <FiChevronLeft size={18} />
                  </button>
                  <button onClick={() => setActiveImage(i => i < images.length - 1 ? i + 1 : 0)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(10,15,30,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <FiChevronRight size={18} />
                  </button>
                </>
              )}
            </motion.div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} style={{ width: 'clamp(60px,15vw,76px)', height: 'clamp(55px,13vw,70px)', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, border: `2px solid ${i === activeImage ? '#6366f1' : 'transparent'}`, opacity: i === activeImage ? 1 : 0.55, cursor: 'pointer', transition: 'all 0.2s', padding: 0 }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px,3vw,18px)' }}>

            {/* Main Info */}
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '20px', padding: 'clamp(20px,4vw,28px)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
              <span style={{ fontSize: '0.7rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{listing.category}</span>
              <h1 style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', fontWeight: 900, color: '#e2e8f0', margin: '8px 0', lineHeight: 1.2 }}>{listing.title}</h1>
              <p style={{ fontSize: 'clamp(2rem,6vw,2.8rem)', fontWeight: 900, color: '#60a5fa', margin: '8px 0', lineHeight: 1 }}>₹{listing.price}</p>
              <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, marginBottom: '12px' }}>
                {listing.status}
              </span>
              <p style={{ color: 'rgba(148,163,184,0.8)', lineHeight: 1.7, fontSize: 'clamp(0.875rem,2.5vw,1rem)', marginBottom: '12px' }}>{listing.description}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'rgba(148,163,184,0.5)' }}>
                <FiClock size={13} />
                <span>Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Seller Card */}
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '20px', padding: 'clamp(18px,4vw,24px)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
              <h3 style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Seller</h3>
              <Link to={`/profile/${listing.seller?._id}`} style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', marginBottom: '16px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: listing.seller?.avatar ? `url(${listing.seller.avatar}) center/cover no-repeat` : 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.2rem', flexShrink: 0, overflow: 'hidden' }}>
                  {!listing.seller?.avatar && (listing.seller?.name?.charAt(0) || 'U')}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#e2e8f0', margin: 0, fontSize: '0.95rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'}
                    onMouseLeave={e => e.currentTarget.style.color = '#e2e8f0'}
                  >{listing.seller?.name}</p>
                  {listing.seller?.university && (
                    <p style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.6)', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiMapPin size={12} /> {listing.seller.university}
                    </p>
                  )}
                  {reviewStats.totalReviews > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <Stars rating={Math.round(reviewStats.avgRating)} />
                      <span style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.7)' }}>
                        {reviewStats.avgRating.toFixed(1)} ({reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {isAuthenticated && !isSeller && listing.status === 'Active' && (
                  <button
                    onClick={() => navigate(`/chat/${listing.seller?._id}`)}
                    style={{
                      width: '100%', padding: '13px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                      color: 'white', fontWeight: 700, fontSize: '0.95rem',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: '0 8px 24px rgba(99,102,241,0.35)', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <FiMessageCircle size={18} /> Chat with Seller
                  </button>
                )}

                {isAuthenticated && !isSeller && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '12px',
                      background: 'transparent',
                      color: '#fbbf24', fontWeight: 600, fontSize: '0.9rem',
                      border: '1px solid rgba(251,191,36,0.3)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'all 0.2s', backdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.1)'; e.currentTarget.style.border = '1px solid rgba(251,191,36,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.border = '1px solid rgba(251,191,36,0.3)'; }}
                  >
                    <FiStar size={16} /> Review Seller
                  </button>
                )}

                {!isAuthenticated && (
                  <Link to="/login" style={{ width: '100%', padding: '13px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
                    Login to Chat or Review
                  </Link>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '20px', padding: 'clamp(18px,4vw,24px)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: 700, color: '#e2e8f0', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Seller Reviews
                </h3>
                {reviewStats.totalReviews > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Stars rating={Math.round(reviewStats.avgRating)} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>{reviewStats.avgRating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <p style={{ color: 'rgba(148,163,184,0.5)', fontSize: '0.875rem', textAlign: 'center', padding: '20px 0' }}>
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '300px', overflowY: 'auto' }}>
                  {reviews.map((review) => (
                    <div key={review._id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>
                            {review.reviewer?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, color: '#e2e8f0', margin: 0, fontSize: '0.85rem' }}>{review.reviewer?.name || 'Anonymous'}</p>
                            <Stars rating={review.rating} />
                          </div>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(148,163,184,0.45)' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p style={{ fontSize: '0.85rem', color: 'rgba(203,213,225,0.8)', margin: 0, lineHeight: 1.55 }}>{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ListingDetailPage;
