import { motion } from 'framer-motion';
import { FiAlertTriangle, FiShield, FiBookOpen, FiInfo } from 'react-icons/fi';

const DisclaimerPage = () => {
  const sections = [
    {
      icon: FiAlertTriangle,
      title: 'Academic Project Notice',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
      content: `Connect Sphere is a non-commercial academic/student project developed solely for educational and portfolio demonstration purposes. This is NOT a registered business, company, startup, or commercial enterprise. It is NOT affiliated with, endorsed by, or associated with any corporation, institution, or registered entity. No commercial use, profit generation, or real-world financial transactions are intended or facilitated.`,
    },
    {
      icon: FiShield,
      title: 'No Warranty & Limitation of Liability',
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.1)',
      content: `This software is provided "AS IS" without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. In no event shall the author(s) be liable for any claim, damages, or other liability arising from the use of this software. You use this application entirely at your own risk.`,
    },
    {
      icon: FiInfo,
      title: 'No Trademark Claim',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)',
      content: `The name "Connect Sphere" is used solely as a project title for academic purposes and does not constitute a trademark, service mark, or brand name. No trademark registration has been filed or is intended. If "Connect Sphere" or any similar name is a registered trademark of another entity, the use here is purely coincidental and unrelated. All third-party names, logos, and trademarks mentioned anywhere in this application belong to their respective owners.`,
    },
    {
      icon: FiBookOpen,
      title: 'No Real Transactions',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
      content: `This platform does NOT process, facilitate, or handle any real financial transactions, payments, or monetary exchanges. Any references to "buying," "selling," or "pricing" within the application are purely demonstrative features built for academic learning. This is a demo/prototype and should not be used for actual commerce.`,
    },
  ];

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #060b16 0%, #0f172a 50%, #1e1b4b 100%)',
        color: 'white',
        paddingTop: 'clamp(5rem,10vw,7rem)',
        paddingBottom: 'clamp(2.5rem,5vw,4rem)',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '-68px',
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px,4vw,24px)', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ fontSize: '3rem', marginBottom: '12px' }}>
            ⚠️
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ fontWeight: 900, marginBottom: '16px', fontSize: 'clamp(1.8rem,5vw,3rem)', lineHeight: 1.1 }}>
            Disclaimer &{' '}
            <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Legal Notice
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontSize: 'clamp(0.9rem,2vw,1.05rem)', color: 'rgba(203,213,225,0.82)', lineHeight: 1.7 }}>
            Connect Sphere is a student-built academic project. Please read the following important notices.
          </motion.p>
        </div>
      </section>

      {/* Student Project Banner */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px clamp(16px,4vw,24px) 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.08))',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: '16px',
          padding: 'clamp(18px,4vw,28px)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 'clamp(0.8rem,2vw,0.95rem)', color: '#fcd34d', fontWeight: 700, marginBottom: '6px' }}>
            🎓 UNIVERSITY STUDENT PROJECT
          </p>
          <p style={{ fontSize: 'clamp(0.78rem,1.8vw,0.88rem)', color: 'rgba(253,224,71,0.7)', lineHeight: 1.6 }}>
            This website was built as an academic project to demonstrate full-stack web development skills.
            It is not a real commercial service and does not facilitate any actual transactions.
          </p>
        </div>
      </div>

      {/* Sections */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(24px,5vw,48px) clamp(16px,4vw,24px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px,3vw,24px)' }}>
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: 'clamp(20px,4vw,28px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: section.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: section.color, flexShrink: 0,
                }}>
                  <section.icon size={20} />
                </div>
                <h2 style={{ fontWeight: 800, color: '#e2e8f0', fontSize: 'clamp(0.95rem,2.5vw,1.1rem)' }}>
                  {section.title}
                </h2>
              </div>
              <p style={{ color: 'rgba(148,163,184,0.8)', lineHeight: 1.8, fontSize: 'clamp(0.83rem,2vw,0.92rem)' }}>
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional Legal Text */}
        <div style={{
          marginTop: 'clamp(24px,4vw,40px)',
          padding: 'clamp(18px,3vw,24px)',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
        }}>
          <h3 style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '12px', fontSize: '0.95rem' }}>Data & Privacy</h3>
          <p style={{ color: 'rgba(148,163,184,0.7)', lineHeight: 1.8, fontSize: 'clamp(0.8rem,1.8vw,0.88rem)', marginBottom: '12px' }}>
            This is a demonstration project. Do not enter real sensitive personal or financial information.
            Any data collected is used solely for the functioning of this demo and is not sold, shared, or used for commercial purposes.
            The developer assumes no responsibility for the security of data entered into this demo application.
          </p>
          <h3 style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '12px', fontSize: '0.95rem' }}>Third-Party Services</h3>
          <p style={{ color: 'rgba(148,163,184,0.7)', lineHeight: 1.8, fontSize: 'clamp(0.8rem,1.8vw,0.88rem)', marginBottom: '12px' }}>
            This project uses free-tier third-party services (MongoDB Atlas, Cloudinary, Resend, Vercel, Render)
            for educational purposes only. Their respective terms and privacy policies apply.
            Use of these services does not imply any commercial relationship or endorsement.
          </p>
          <h3 style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '12px', fontSize: '0.95rem' }}>User Acknowledgment</h3>
          <p style={{ color: 'rgba(148,163,184,0.7)', lineHeight: 1.8, fontSize: 'clamp(0.8rem,1.8vw,0.88rem)' }}>
            By using this application, you acknowledge that this is a student project, no warranties or guarantees
            are provided, and you use it entirely at your own risk. The developer assumes no liability for any
            use or misuse of this application.
          </p>
        </div>
      </section>
    </div>
  );
};
export default DisclaimerPage;
