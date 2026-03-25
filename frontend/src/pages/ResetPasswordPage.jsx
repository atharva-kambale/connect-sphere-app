import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import * as api from '../services/api';
import FormContainer from '../components/FormContainer';
import { FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '12px',
  padding: '13px 44px 13px 44px',
  color: '#f1f5f9',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box',
};

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showP, setShowP] = useState(false);
  const [showC, setShowC] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setError('');
    setLoading(true);
    try {
      await api.resetPassword({ token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (e) => {
    e.target.style.border = '1px solid rgba(96,165,250,0.5)';
    e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.1)';
    e.target.style.background = 'rgba(255,255,255,0.1)';
  };
  const blurStyle = (e) => {
    e.target.style.border = '1px solid rgba(255,255,255,0.15)';
    e.target.style.boxShadow = 'none';
    e.target.style.background = 'rgba(255,255,255,0.07)';
  };

  if (success) {
    return (
      <FormContainer title="Password Reset!" subtitle="Your password has been updated">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
          <p style={{ color: 'rgba(148,163,184,0.8)', marginBottom: '20px' }}>
            Redirecting you to login…
          </p>
          <Link to="/login" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>
            Go to Login →
          </Link>
        </div>
      </FormContainer>
    );
  }

  return (
    <FormContainer title="Reset Password" subtitle="Enter your new password below">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: '12px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* New password */}
        <div style={{ position: 'relative' }}>
          <FiLock size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148,163,184,0.6)', pointerEvents: 'none' }} />
          <input
            type={showP ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            required
            style={inputStyle}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
          <button type="button" onClick={() => setShowP(!showP)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(148,163,184,0.5)', padding: '4px' }}>
            {showP ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>

        {/* Confirm password */}
        <div style={{ position: 'relative' }}>
          <FiLock size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148,163,184,0.6)', pointerEvents: 'none' }} />
          <input
            type={showC ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            style={inputStyle}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
          <button type="button" onClick={() => setShowC(!showC)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(148,163,184,0.5)', padding: '4px' }}>
            {showC ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || !token}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: (loading || !token) ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: 'white', fontWeight: 700, fontSize: '0.95rem',
            border: 'none', cursor: (loading || !token) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: (loading || !token) ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Resetting...' : <><span>Set New Password</span><FiArrowRight size={16} /></>}
        </button>
      </form>
      <p style={{ textAlign: 'center', color: 'rgba(148,163,184,0.7)', marginTop: '20px', fontSize: '0.875rem' }}>
        <Link to="/login" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>← Back to Login</Link>
      </p>
    </FormContainer>
  );
};
export default ResetPasswordPage;
