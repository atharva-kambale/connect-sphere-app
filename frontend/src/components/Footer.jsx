import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiGithub, FiTwitter, FiMail, FiInstagram, FiArrowRight } from 'react-icons/fi';

const Footer = () => {
  const year = new Date().getFullYear();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const showCTA = !isAuthenticated && pathname !== '/';

  return (
    <footer style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #060b16 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Glow orbs */}
      <div style={{
        position: 'absolute', top: '-80px', left: '10%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', right: '15%',
        width: '250px', height: '250px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Top CTA band — only for guests, not on landing page */}
      {showCTA && (
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(135deg, #0a0f1e, #0f172a)' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: 'clamp(32px,6vw,64px) clamp(16px,5vw,40px)', textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(2rem,5vw,2.6rem)', marginBottom: '12px' }}>🚀</div>
            <h3 style={{
              fontSize: 'clamp(1.3rem,4vw,2rem)', fontWeight: 900, marginBottom: '10px',
              color: 'white',
            }}>
              Ready to join your campus marketplace?
            </h3>
            <p style={{ color: 'rgba(148,163,184,0.72)', fontSize: 'clamp(0.85rem,2vw,1rem)', marginBottom: 'clamp(18px,4vw,28px)' }}>
              Sign up takes less than 2 minutes.
            </p>
            <Link
              to="/register"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: 'clamp(11px,3vw,14px) clamp(22px,5vw,32px)', borderRadius: '9999px',
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                color: 'white', fontWeight: 700, fontSize: 'clamp(0.85rem,2.5vw,0.95rem)',
                textDecoration: 'none', boxShadow: '0 8px 28px rgba(99,102,241,0.38)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(99,102,241,0.52)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.38)'; }}
            >
              Get Started Free <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand col */}
          <div className="md:col-span-5">
            <Link
              to="/"
              style={{
                display: 'inline-block',
                fontSize: '1.6rem', fontWeight: 900, marginBottom: '12px',
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textDecoration: 'none',
              }}
            >
              Connect Sphere
            </Link>
            <p style={{ color: 'rgba(148,163,184,0.65)', lineHeight: 1.7, maxWidth: '320px', fontSize: '0.9rem' }}>
              The trusted peer-to-peer marketplace built exclusively for university communities. Verified students, real campus deals.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: FiGithub, href: '#', label: 'GitHub' },
                { icon: FiTwitter, href: '#', label: 'Twitter' },
                { icon: FiInstagram, href: '#', label: 'Instagram' },
                { icon: FiMail, href: '#', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  title={label}
                  style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(148,163,184,0.8)',
                    transition: 'all 0.2s', textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.2)';
                    e.currentTarget.style.color = '#a78bfa';
                    e.currentTarget.style.border = '1px solid rgba(167,139,250,0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = 'rgba(148,163,184,0.8)';
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="md:col-span-3">
            <h4 style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '16px', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/browse', label: 'Browse Listings' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/register', label: 'Sign Up Free' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ color: 'rgba(148,163,184,0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,0.7)'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '16px', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Community Guidelines'].map(label => (
                <li key={label}>
                  <a
                    href="#"
                    style={{ color: 'rgba(148,163,184,0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,0.7)'}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '48px', paddingTop: '28px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '4px 12px', borderRadius: '9999px',
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.25)',
                color: '#6ee7b7', fontSize: '0.75rem', fontWeight: 600,
              }}
            >
              <span style={{ width: '6px', height: '6px', background: '#34d399', borderRadius: '50%', boxShadow: '0 0 6px #34d399' }} />
              All systems operational
            </span>
          </div>
          <p style={{ color: 'rgba(100,116,139,0.7)', fontSize: '0.8rem', textAlign: 'center' }}>
            © {year} Connect Sphere. All rights reserved. Made with ❤️ for students.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
