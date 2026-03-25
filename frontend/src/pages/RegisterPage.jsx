import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import FormContainer from '../components/FormContainer';
import { FiUser, FiMail, FiLock, FiBookOpen, FiArrowRight } from 'react-icons/fi';

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

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', university: '', campus: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.register(form);
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) {
        setError(data.errors.map(e => e.message).join('. '));
      } else {
        setError(data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', type: 'text', placeholder: 'Full Name', icon: FiUser },
    { name: 'email', type: 'email', placeholder: 'University Email', icon: FiMail },
    { name: 'password', type: 'password', placeholder: 'Create Password', icon: FiLock },
    { name: 'university', type: 'text', placeholder: 'University Name', icon: FiBookOpen },
    { name: 'campus', type: 'text', placeholder: 'Campus (optional)', icon: FiBookOpen },
  ];

  return (
    <FormContainer title="Create Account" subtitle="Join your campus marketplace today">
      <form onSubmit={handleSubmit} className="space-y-4">
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
        {fields.map((f) => (
          <InputField
            key={f.name}
            icon={f.icon}
            name={f.name}
            type={f.type}
            value={form[f.name]}
            onChange={handleChange}
            placeholder={f.placeholder}
            required={f.name !== 'campus'}
          />
        ))}
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
          {loading ? 'Creating Account...' : <><span>Sign Up</span><FiArrowRight /></>}
        </button>
      </form>
      <p className="text-center mt-6 text-sm" style={{ color: 'rgba(148,163,184,0.8)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#93c5fd', fontWeight: 600 }}>Sign in</Link>
      </p>
    </FormContainer>
  );
};
export default RegisterPage;
