import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/authSlice';
import * as api from '../services/api';
import FormContainer from '../components/FormContainer';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon
      size={16}
      style={{
        position: 'absolute', left: '16px', top: '50%',
        transform: 'translateY(-50%)', color: 'rgba(148,163,184,0.7)',
        pointerEvents: 'none',
      }}
    />
    <input
      {...props}
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '12px',
        padding: '14px 16px 14px 44px',
        color: '#f1f5f9',
        fontSize: '0.9rem',
        outline: 'none',
        transition: 'all 0.2s',
      }}
      onFocus={e => {
        e.target.style.border = '1px solid rgba(96,165,250,0.6)';
        e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.12)';
        e.target.style.background = 'rgba(255,255,255,0.11)';
      }}
      onBlur={e => {
        e.target.style.border = '1px solid rgba(255,255,255,0.15)';
        e.target.style.boxShadow = 'none';
        e.target.style.background = 'rgba(255,255,255,0.08)';
      }}
    />
    <style>{`
      input::placeholder { color: rgba(148, 163, 184, 0.6) !important; }
      input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px rgba(30,27,75,0.9) inset !important;
        -webkit-text-fill-color: #f1f5f9 !important;
      }
    `}</style>
  </div>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.login({ email, password });
      dispatch(setCredentials({ user: data, token: data.token }));
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      if (err.response?.data?.needsVerification) {
        navigate('/verify-otp', { state: { email } });
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer title="Welcome Back" subtitle="Sign in to your Connect Sphere account">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}
        <InputField icon={FiMail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required />
        <InputField icon={FiLock} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <div className="flex justify-end">
          <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#93c5fd' }}>Forgot password?</Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full font-bold flex items-center justify-center gap-2"
          style={{
            padding: '14px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: 'white',
            fontSize: '0.95rem',
            boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {loading ? 'Signing in...' : <><span>Sign In</span><FiArrowRight /></>}
        </button>
      </form>
      <p className="text-center mt-6 text-sm" style={{ color: 'rgba(148,163,184,0.8)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#93c5fd', fontWeight: 600 }}>Sign up</Link>
      </p>
    </FormContainer>
  );
};
export default LoginPage;
