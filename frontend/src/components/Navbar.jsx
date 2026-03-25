import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import * as api from '../services/api';
import {
  FiMenu, FiX, FiUser, FiLogOut,
  FiHome, FiInfo, FiMail, FiSettings, FiGrid, FiMessageSquare
} from 'react-icons/fi';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Always start transparent — only add glass effect on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Fetch unread message count
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUnread = async () => {
      try {
        const { data } = await api.getConversations();
        const userId = user?._id;
        if (userId && Array.isArray(data)) {
          // If user is on /inbox or /chat/* page, the messages are being read — clear the dot
          const isReadingMessages = location.pathname.startsWith('/inbox') || location.pathname.startsWith('/chat');
          if (isReadingMessages) {
            setUnreadCount(0);
            return;
          }
          let total = 0;
          data.forEach(conv => {
            const count = conv.unreadCount && conv.unreadCount[userId];
            if (count) total += count;
          });
          setUnreadCount(total);
        }
      } catch (err) {
        // silently fail — don't break the navbar
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user, location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const hasUnread = unreadCount > 0;

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s ease',
          background: scrolled ? 'rgba(10,15,30,0.82)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '68px' }}>
            
            {/* Logo */}
            <Link
              to="/"
              style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                flexShrink: 0,
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 10px rgba(96,165,250,0.4))',
                letterSpacing: '-0.02em',
              }}
            >
              Connect Sphere
            </Link>

            {/* Desktop Nav — right aligned */}
            <div style={{ display: 'none', alignItems: 'center', gap: '4px', marginLeft: 'auto' }} className="desk-nav">
              {[
                { to: '/', icon: FiHome, label: 'Home' },
                { to: '/browse', icon: FiGrid, label: 'Browse' },
                { to: '/about', icon: FiInfo, label: 'About' },
                { to: '/contact', icon: FiMail, label: 'Contact' },
              ].map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: isActive(to) ? '#60a5fa' : 'rgba(226,232,240,0.9)',
                    background: isActive(to) ? 'rgba(96,165,250,0.1)' : 'transparent',
                    transition: 'all 0.2s',
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                  }}
                  onMouseEnter={e => {
                    if (!isActive(to)) {
                      e.currentTarget.style.color = '#93c5fd';
                      e.currentTarget.style.background = 'rgba(96,165,250,0.08)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive(to)) {
                      e.currentTarget.style.color = 'rgba(226,232,240,0.9)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon size={14} />{label}
                </Link>
              ))}

              <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.12)', margin: '0 8px' }} />

              {isAuthenticated ? (
                <>

                  <Link
                    to="/inbox"
                    title="Messages"
                    style={{
                      position: 'relative', padding: '8px', borderRadius: '10px',
                      color: 'rgba(226,232,240,0.75)', textDecoration: 'none', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#60a5fa'; e.currentTarget.style.background = 'rgba(96,165,250,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(226,232,240,0.75)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <FiMessageSquare size={18} />
                    {hasUnread && (
                      <span style={{
                        position: 'absolute', top: '5px', right: '5px',
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#f87171', boxShadow: '0 0 6px #f87171',
                        border: '1.5px solid rgba(10,15,30,0.9)',
                      }} />
                    )}
                  </Link>

                  {/* Avatar dropdown */}
                  <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: user?.avatar ? `url(${user.avatar}) center/cover no-repeat` : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: 'white', fontWeight: 700, fontSize: '0.85rem',
                        border: 'none', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.5)',
                        transition: 'all 0.2s', overflow: 'hidden',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      {!user?.avatar && (user?.name?.charAt(0)?.toUpperCase() || 'U')}
                    </button>
                    {dropdownOpen && (
                      <div
                        style={{
                          position: 'absolute', right: 0, top: '48px',
                          width: '210px', borderRadius: '14px', padding: '6px',
                          background: 'rgba(10,15,30,0.97)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(24px)',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                          zIndex: 200,
                        }}
                      >
                        <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', margin: 0 }}>{user?.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.7)', margin: '2px 0 0' }}>{user?.email}</p>
                        </div>
                        {[
                          { to: '/dashboard', icon: FiUser, label: 'Dashboard' },
                          { to: '/settings', icon: FiSettings, label: 'Settings' },
                        ].map(({ to, icon: Icon, label }) => (
                          <Link
                            key={to}
                            to={to}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '10px 14px', fontSize: '0.875rem',
                              color: 'rgba(226,232,240,0.85)', textDecoration: 'none',
                              borderRadius: '8px', transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#60a5fa'; e.currentTarget.style.background = 'rgba(96,165,250,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(226,232,240,0.85)'; e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Icon size={14} />{label}
                          </Link>
                        ))}
                        <hr style={{ borderColor: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />
                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '10px 14px', fontSize: '0.875rem',
                            color: '#f87171', background: 'transparent',
                            border: 'none', cursor: 'pointer', width: '100%',
                            textAlign: 'left', borderRadius: '8px', transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <FiLogOut size={14} />Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link
                    to="/login"
                    style={{
                      padding: '8px 14px', borderRadius: '10px',
                      fontSize: '0.875rem', fontWeight: 600,
                      color: 'rgba(226,232,240,0.9)', textDecoration: 'none',
                      transition: 'all 0.2s', textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#60a5fa'; e.currentTarget.style.background = 'rgba(96,165,250,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(226,232,240,0.9)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    style={{
                      padding: '9px 22px', borderRadius: '9999px',
                      fontSize: '0.875rem', fontWeight: 700, color: 'white',
                      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                      boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
                      textDecoration: 'none', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle + Message Icon (mobile only) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="mob-right">
              {isAuthenticated && (
                <Link
                  to="/inbox"
                  title="Messages"
                  className="mob-msg-icon"
                  style={{
                    position: 'relative', padding: '8px', borderRadius: '10px',
                    color: 'rgba(226,232,240,0.75)', textDecoration: 'none', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <FiMessageSquare size={20} />
                  {hasUnread && (
                    <span style={{
                      position: 'absolute', top: '5px', right: '5px',
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: '#f87171', boxShadow: '0 0 6px #f87171',
                      border: '1.5px solid rgba(10,15,30,0.9)',
                    }} />
                  )}
                </Link>
              )}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="mob-toggle"
                style={{
                  padding: '8px', borderRadius: '10px', border: 'none',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(226,232,240,0.9)', cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div
            style={{
              position: 'fixed',
              top: '68px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(10,15,30,0.99)',
              backdropFilter: 'blur(24px)',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              padding: '20px 16px',
              overflowY: 'auto',
              zIndex: 99,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {[
              { to: '/', icon: FiHome, label: 'Home' },
              { to: '/browse', icon: FiGrid, label: 'Browse' },
              { to: '/about', icon: FiInfo, label: 'About' },
              { to: '/contact', icon: FiMail, label: 'Contact' },
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 16px', borderRadius: '12px',
                  fontSize: '1rem', fontWeight: 600,
                  color: isActive(to) ? '#60a5fa' : 'rgba(226,232,240,0.85)',
                  background: isActive(to) ? 'rgba(96,165,250,0.1)' : 'transparent',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
              >
                <Icon size={18} />{label}
              </Link>
            ))}

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '8px 0' }} />

            {isAuthenticated ? (
              <>
                {user && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 16px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                  }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: user?.avatar ? `url(${user.avatar}) center/cover no-repeat` : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '1rem', flexShrink: 0,
                      overflow: 'hidden',
                    }}>
                      {!user?.avatar && (user?.name?.charAt(0)?.toUpperCase() || 'U')}
                    </div>
                    <div>
                      <p style={{ color: 'white', fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>{user.name}</p>
                      <p style={{ color: 'rgba(148,163,184,0.6)', margin: '2px 0 0', fontSize: '0.78rem' }}>{user.email}</p>
                    </div>
                  </div>
                )}
                <Link to="/inbox" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, color: 'rgba(226,232,240,0.85)', textDecoration: 'none', position: 'relative' }}>
                  <FiMessageSquare size={18} /> Messages
                  {hasUnread && (
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: '#f87171', boxShadow: '0 0 6px #f87171',
                      marginLeft: '4px',
                    }} />
                  )}
                </Link>
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, color: 'rgba(226,232,240,0.85)', textDecoration: 'none' }}>
                  <FiUser size={18} /> Dashboard
                </Link>
                <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, color: 'rgba(226,232,240,0.85)', textDecoration: 'none' }}>
                  <FiSettings size={18} /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 16px', borderRadius: '12px',
                    fontSize: '1rem', fontWeight: 600, color: '#f87171',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    width: '100%', textAlign: 'left', marginTop: '8px',
                  }}
                >
                  <FiLogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    display: 'block', padding: '14px 16px', borderRadius: '12px',
                    fontSize: '1rem', fontWeight: 600, color: 'rgba(226,232,240,0.85)',
                    textDecoration: 'none', textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    display: 'block', padding: '14px 16px', borderRadius: '12px',
                    fontSize: '1rem', fontWeight: 700, color: 'white',
                    textDecoration: 'none', textAlign: 'center', marginTop: '8px',
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
                  }}
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Spacer so content isn't hidden behind fixed navbar */}
      <div style={{ height: '68px' }} />

      <style>{`
        @media (min-width: 768px) {
          .desk-nav { display: flex !important; }
          .mob-toggle { display: none !important; }
          .mob-msg-icon { display: none !important; }
          .mob-right { display: flex; }
        }
        @media (max-width: 767px) {
          .mob-right { display: flex; }
          .mob-msg-icon { display: flex !important; }
        }
      `}</style>
    </>
  );
};
export default Navbar;
