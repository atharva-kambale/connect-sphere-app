import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/authSlice';
import * as api from '../services/api';
import FormContainer from '../components/FormContainer';

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = location.state?.email || '';

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const timer = setInterval(() => setResendTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return setError('Please enter all 6 digits');
    setError('');
    setLoading(true);
    try {
      const { data } = await api.verifyOTP({ email, otp: code });
      dispatch(setCredentials({ user: data, token: data.token }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.resendOTP({ email });
      setResendTimer(60);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <FormContainer title="Verify Your Email" subtitle={`We sent a 6-digit code to ${email || 'your email'}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm text-center">{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(6px,1.5vw,10px)', flexWrap: 'nowrap', overflow: 'hidden' }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: 'clamp(38px,10vw,52px)', height: 'clamp(44px,12vw,60px)',
                textAlign: 'center', fontSize: 'clamp(1.2rem,4vw,1.8rem)', fontWeight: 700,
                background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '12px', color: 'white', outline: 'none', transition: 'all 0.2s',
                flexShrink: 0,
              }}
              onFocus={e => { e.target.style.border = '1px solid rgba(96,165,250,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.15)'; }}
              onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.18)'; e.target.style.boxShadow = 'none'; }}
            />
          ))}
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50">
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
        <p className="text-center text-gray-400 text-sm">
          {resendTimer > 0 ? `Resend code in ${resendTimer}s` : <button type="button" onClick={handleResend} className="text-blue-400 hover:text-blue-300 font-medium">Resend Code</button>}
        </p>
      </form>
    </FormContainer>
  );
};
export default VerifyOTPPage;
