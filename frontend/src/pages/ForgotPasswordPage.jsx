import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import FormContainer from '../components/FormContainer';
import { FiMail, FiArrowRight } from 'react-icons/fi';

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '12px',
  padding: '13px 16px 13px 44px',
  color: '#f1f5f9',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box',
};

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <FormContainer title="Check Your Email" subtitle="We've sent a password reset link">
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', margin: '0 auto 20px', background: 'rgba(52,211,153,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiMail size={32} style={{ color: '#34d399' }} />
          </div>
          <p style={{ color: 'rgba(203,213,225,0.85)', marginBottom: '20px', lineHeight: 1.6, fontSize: '0.95rem' }}>
            Check your inbox at <strong style={{ color: 'white' }}>{email}</strong> for a reset link. Click the button in the email to set your new password.
          </p>
          <Link to="/login" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Login</Link>
        </div>
      </FormContainer>
    );
  }

  return (
    <FormContainer title="Forgot Password?" subtitle="Enter your email to receive a reset link">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: '12px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}
        <div style={{ position: 'relative' }}>
          <FiMail
            size={17}
            style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: 'rgba(148,163,184,0.6)', pointerEvents: 'none',
            }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            style={inputStyle}
            onFocus={e => {
              e.target.style.border = '1px solid rgba(96,165,250,0.5)';
              e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.1)';
              e.target.style.background = 'rgba(255,255,255,0.1)';
            }}
            onBlur={e => {
              e.target.style.border = '1px solid rgba(255,255,255,0.15)';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'rgba(255,255,255,0.07)';
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: 'white', fontWeight: 700, fontSize: '0.95rem',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {loading ? 'Sending...' : <><span>Send Reset Link</span><FiArrowRight size={16} /></>}
        </button>
      </form>
      <p style={{ textAlign: 'center', color: 'rgba(148,163,184,0.7)', marginTop: '20px', fontSize: '0.875rem' }}>
        Remember your password?{' '}
        <Link to="/login" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
      </p>
    </FormContainer>
  );
};
export default ForgotPasswordPage;
