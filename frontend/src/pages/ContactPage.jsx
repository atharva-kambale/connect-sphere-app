import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiSend, FiMessageCircle } from 'react-icons/fi';

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '12px',
  padding: '13px 16px',
  color: '#f1f5f9',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box',
};

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #060b16 0%, #0f172a 50%, #1e1b4b 100%)',
        paddingTop: 'clamp(5rem,10vw,7rem)',
        paddingBottom: 'clamp(3rem,6vw,5rem)',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '-68px',
      }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 'clamp(200px,40vw,500px)', height: 'clamp(200px,40vw,500px)', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 'clamp(150px,30vw,350px)', height: 'clamp(150px,30vw,350px)', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* Floating emojis */}
        <div className="ct-stickers">
          {[
            { emoji: '✉️', top: '20%', left: '5%', size: '2.5rem', delay: '0s', dur: '6s' },
            { emoji: '💬', top: '30%', right: '8%', size: '2rem', delay: '1s', dur: '8s' },
            { emoji: '🤝', bottom: '20%', left: '10%', size: '2rem', delay: '2s', dur: '7s' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', top: s.top, left: s.left, right: s.right, bottom: s.bottom, fontSize: s.size, opacity: 0.15, animation: `floatSticker ${s.dur} ease-in-out infinite ${s.delay}`, pointerEvents: 'none' }}>
              {s.emoji}
            </div>
          ))}
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(16px,4vw,24px)', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 'clamp(2.2rem,7vw,4rem)', fontWeight: 900, color: 'white', marginBottom: '16px' }}>
            Get in <span style={{ background: 'linear-gradient(135deg, #60a5fa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Touch</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ color: 'rgba(203,213,225,0.75)', fontSize: 'clamp(0.9rem,2.5vw,1.1rem)' }}>
            We'd love to hear from you
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: 'clamp(40px,7vw,70px) clamp(16px,4vw,24px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,320px), 1fr))', gap: 'clamp(28px,5vw,48px)' }}>

          {/* Left - Info */}
          <div>
            <h2 style={{ fontSize: 'clamp(1.3rem,3.5vw,1.6rem)', fontWeight: 800, color: '#e2e8f0', marginBottom: '24px' }}>Contact Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: FiMail, title: 'Email', value: 'support@connectsphere.edu', color: '#60a5fa' },
                { icon: FiMapPin, title: 'Location', value: 'Your University Campus', color: '#a78bfa' },
                { icon: FiMessageCircle, title: 'Response Time', value: 'Within 24 hours', color: '#34d399' },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', minWidth: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#e2e8f0', margin: 0, fontSize: '0.95rem' }}>{item.title}</p>
                    <p style={{ color: 'rgba(148,163,184,0.7)', margin: '4px 0 0', fontSize: '0.875rem' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '24px', padding: 'clamp(24px,4vw,36px)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: 'clamp(24px,5vw,40px) 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>Message Sent!</h3>
                <p style={{ color: 'rgba(148,163,184,0.75)' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  name="name" value={form.name} onChange={handleChange}
                  placeholder="Your Name" required
                  style={inputStyle}
                  onFocus={e => { e.target.style.border = '1px solid rgba(96,165,250,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.1)'; }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
                />
                <input
                  name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="Your Email" required
                  style={inputStyle}
                  onFocus={e => { e.target.style.border = '1px solid rgba(96,165,250,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.1)'; }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
                />
                <textarea
                  name="message" value={form.message} onChange={handleChange}
                  placeholder="Your Message" required rows={4}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => { e.target.style.border = '1px solid rgba(96,165,250,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.1)'; }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="submit"
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    color: 'white', fontWeight: 700, fontSize: '0.95rem',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FiSend size={16} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) { .ct-stickers { display: none; } }
      `}</style>
    </div>
  );
};
export default ContactPage;
