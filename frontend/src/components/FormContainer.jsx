const FormContainer = ({ children, title, subtitle }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(80px,12vw,100px) clamp(16px,4vw,24px) clamp(40px,8vw,60px)',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #060b16 0%, #0f172a 50%, #1e1b4b 100%)',
        marginTop: '-68px',
      }}
    >
      {/* Animated blobs */}
      <div
        style={{
          position: 'absolute', top: '-10rem', right: '-10rem',
          width: 'clamp(200px,40vw,500px)', height: 'clamp(200px,40vw,500px)',
          background: 'radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 70%)',
          borderRadius: '50%', animation: 'blob1 8s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute', bottom: '-10rem', left: '-10rem',
          width: 'clamp(200px,40vw,500px)', height: 'clamp(200px,40vw,500px)',
          background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)',
          borderRadius: '50%', animation: 'blob2 10s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Floating stickers – desktop only */}
      <div className="fc-stickers">
        {[
          { emoji: '📚', top: '15%', left: '8%', delay: '0s', dur: '6s' },
          { emoji: '🎓', top: '25%', right: '10%', delay: '1s', dur: '8s' },
          { emoji: '💻', bottom: '20%', left: '12%', delay: '2s', dur: '7s' },
          { emoji: '🛒', bottom: '30%', right: '8%', delay: '0.5s', dur: '9s' },
          { emoji: '✨', top: '60%', left: '5%', delay: '3s', dur: '7.5s' },
          { emoji: '🔮', top: '5%', right: '25%', delay: '1.5s', dur: '5s' },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: s.top, left: s.left, right: s.right, bottom: s.bottom,
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            opacity: 0.25,
            animation: `floatSticker ${s.dur} ease-in-out infinite ${s.delay}`,
            pointerEvents: 'none',
          }}>
            {s.emoji}
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '440px', zIndex: 10 }}>
        <div
          style={{
            borderRadius: '28px',
            padding: 'clamp(24px,5vw,36px)',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {title && (
            <h2
              style={{
                fontSize: 'clamp(1.6rem,5vw,2rem)',
                fontWeight: 900,
                textAlign: 'center',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #fff 30%, #93c5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{ textAlign: 'center', marginBottom: 'clamp(20px,4vw,28px)', fontSize: '0.875rem', color: 'rgba(148,163,184,0.85)' }}>
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .fc-stickers { display: none; } }
      `}</style>
    </div>
  );
};
export default FormContainer;
