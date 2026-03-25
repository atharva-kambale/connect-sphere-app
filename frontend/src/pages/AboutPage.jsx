import { motion } from 'framer-motion';
import { FiShield, FiUsers, FiHeart, FiTarget } from 'react-icons/fi';

const STICKERS = [
  { emoji: '🎓', top: '20%', left: '5%', size: '3rem', delay: '0s', dur: '6s' },
  { emoji: '📚', top: '30%', right: '6%', size: '2.5rem', delay: '1s', dur: '8s' },
  { emoji: '🌐', bottom: '15%', right: '12%', size: '2rem', delay: '2s', dur: '7s' },
  { emoji: '💡', top: '55%', left: '3%', size: '2rem', delay: '0.5s', dur: '9s' },
];

const AboutPage = () => {
  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #060b16 0%, #0f172a 50%, #1e1b4b 100%)',
        color: 'white',
        paddingTop: 'clamp(5rem,10vw,7rem)',
        paddingBottom: 'clamp(3rem,7vw,5rem)',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '-68px',
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 'clamp(200px,40vw,500px)', height: 'clamp(200px,40vw,500px)', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: 'clamp(200px,35vw,400px)', height: 'clamp(200px,35vw,400px)', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* Floating stickers - desktop only */}
        <div className="ab-stickers">
          {STICKERS.map((s, i) => (
            <div key={i} style={{ position: 'absolute', top: s.top, left: s.left, right: s.right, bottom: s.bottom, fontSize: s.size, opacity: 0.15, animation: `floatSticker ${s.dur} ease-in-out infinite ${s.delay}`, pointerEvents: 'none' }}>
              {s.emoji}
            </div>
          ))}
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(16px,4vw,24px)', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontWeight: 900, marginBottom: '20px', fontSize: 'clamp(2.2rem, 7vw, 4rem)', lineHeight: 1.1 }}
          >
            About{' '}
            <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Connect Sphere
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 'clamp(0.95rem,2.5vw,1.15rem)', color: 'rgba(203,213,225,0.82)', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto' }}
          >
            We're building the most trusted peer-to-peer marketplace exclusively for university communities. Because students deserve a platform built for them.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(24px,5vw,40px) clamp(16px,4vw,24px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(16px,4vw,24px)' }} className="stats-grid">
            {[
              { value: '10K+', label: 'Students', emoji: '🎓' },
              { value: '50+', label: 'Universities', emoji: '🏫' },
              { value: '25K+', label: 'Listings', emoji: '📦' },
              { value: '98%', label: 'Happy Users', emoji: '😊' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ padding: 'clamp(16px,3vw,24px)', textAlign: 'center', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div style={{ fontSize: 'clamp(1.3rem,3.5vw,1.5rem)', marginBottom: '4px' }}>{stat.emoji}</div>
                <div style={{ fontSize: 'clamp(1.6rem,5vw,2rem)', fontWeight: 900, color: '#e2e8f0' }}>{stat.value}</div>
                <div style={{ color: 'rgba(148,163,184,0.7)', fontSize: 'clamp(0.78rem,2vw,0.875rem)', fontWeight: 600 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(40px,8vw,80px) clamp(16px,4vw,24px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(32px,6vw,56px)', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.6rem,4vw,2rem)', fontWeight: 900, color: '#e2e8f0', marginBottom: '20px' }}>Our Mission</h2>
            <p style={{ color: 'rgba(148,163,184,0.8)', lineHeight: 1.8, marginBottom: '16px', fontSize: 'clamp(0.9rem,2.5vw,1rem)' }}>
              Connect Sphere was born from a simple idea: university students need a safe, dedicated space to buy, sell, and trade academic resources and personal items within their campus community.
            </p>
            <p style={{ color: 'rgba(148,163,184,0.8)', lineHeight: 1.8, fontSize: 'clamp(0.9rem,2.5vw,1rem)' }}>
              We verify every user through their institutional email, creating a trusted environment where students can transact with confidence — no anonymous strangers, just verified peers.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(12px,3vw,16px)' }}>
            {[
              { icon: FiShield, title: 'Secure', desc: 'Verified users only', color: '#60a5fa', bg: 'rgba(59,130,246,0.1)' },
              { icon: FiUsers, title: 'Community', desc: 'Campus-first approach', color: '#a78bfa', bg: 'rgba(139,92,246,0.1)' },
              { icon: FiHeart, title: 'Trusted', desc: 'Reputation-driven', color: '#f472b6', bg: 'rgba(236,72,153,0.1)' },
              { icon: FiTarget, title: 'Focused', desc: 'Students for students', color: '#34d399', bg: 'rgba(16,185,129,0.1)' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '16px',
                  padding: 'clamp(16px,3vw,24px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  textAlign: 'center',
                  cursor: 'default',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ width: '44px', height: '44px', margin: '0 auto 10px', background: item.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                  <item.icon size={22} />
                </div>
                <h3 style={{ fontWeight: 800, color: '#e2e8f0', marginBottom: '4px', fontSize: 'clamp(0.85rem,2vw,0.95rem)' }}>{item.title}</h3>
                <p style={{ fontSize: 'clamp(0.73rem,1.8vw,0.8rem)', color: 'rgba(148,163,184,0.65)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 640px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .ab-stickers { display: none; }
        }
      `}</style>
    </div>
  );
};
export default AboutPage;
