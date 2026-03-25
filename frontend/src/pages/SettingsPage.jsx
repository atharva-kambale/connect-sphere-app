import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as api from '../services/api';
import { setCredentials } from '../features/authSlice';
import { FiSave, FiUser, FiMail, FiBookOpen, FiLock, FiCamera, FiX } from 'react-icons/fi';

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  padding: '13px 16px',
  color: '#f1f5f9',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'rgba(148,163,184,0.9)',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', university: '', campus: '', bio: '', password: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', university: user.university || '', campus: user.campus || '', bio: user.bio || '', password: '' });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      let avatarUrl = user?.avatar || '';

      // Upload avatar if a new file was selected
      if (avatarFile) {
        setAvatarUploading(true);
        const formData = new FormData();
        formData.append('images', avatarFile);
        const uploadRes = await api.uploadImages(formData);
        avatarUrl = uploadRes.data.urls[0];
        setAvatarUploading(false);
      } else if (!avatarPreview && user?.avatar) {
        // User removed avatar
        avatarUrl = '';
      }

      const updateData = { ...form, avatar: avatarUrl };
      if (!updateData.password) delete updateData.password;
      const { data } = await api.updateUserProfile(updateData);
      dispatch(setCredentials({ user: { ...user, ...data }, token: localStorage.getItem('token') }));
      setSuccess('Profile updated successfully!');
      setAvatarFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setAvatarUploading(false);
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (e) => {
    e.target.style.border = '1px solid rgba(96,165,250,0.5)';
    e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.1)';
    e.target.style.background = 'rgba(255,255,255,0.09)';
  };
  const blurStyle = (e) => {
    e.target.style.border = '1px solid rgba(255,255,255,0.1)';
    e.target.style.boxShadow = 'none';
    e.target.style.background = 'rgba(255,255,255,0.06)';
  };

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', padding: 'clamp(24px,5vw,40px) 0' }}>
      <div style={{ maxWidth: '660px', margin: '0 auto', padding: '0 clamp(16px,4vw,24px)' }}>
        
        <h1 style={{ fontSize: 'clamp(1.6rem,5vw,2rem)', fontWeight: 900, color: '#e2e8f0', marginBottom: 'clamp(20px,4vw,32px)' }}>Settings</h1>

        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '24px',
          padding: 'clamp(24px,5vw,36px)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column', gap: 'clamp(16px,3vw,22px)',
        }}>
          {success && (
            <div style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', color: '#6ee7b7', padding: '12px 16px', borderRadius: '12px', fontSize: '0.875rem' }}>
              ✅ {success}
            </div>
          )}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: '12px', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {/* Avatar Upload Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <label style={{ ...labelStyle, textAlign: 'center', marginBottom: '0' }}>Profile Photo</label>
            <div style={{ position: 'relative' }}>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid rgba(99,102,241,0.5)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  }}
                />
              ) : (
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'white',
                  border: '3px solid rgba(99,102,241,0.5)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              {/* Camera overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <FiCamera size={14} />
              </button>
              {/* Remove avatar button */}
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(239,68,68,0.9)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <FiX size={12} />
                </button>
              )}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.5)', margin: 0 }}>JPG, PNG or WebP. Max 5MB.</p>
          </div>

          <div>
            <label style={labelStyle}><FiUser size={12} style={{ display: 'inline', marginRight: '6px' }} />Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          <div>
            <label style={labelStyle}><FiMail size={12} style={{ display: 'inline', marginRight: '6px' }} />Email</label>
            <input value={user?.email || ''} disabled style={{ ...inputStyle, background: 'rgba(255,255,255,0.03)', color: 'rgba(148,163,184,0.5)', cursor: 'not-allowed' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'clamp(12px,3vw,16px)' }}>
            <div>
              <label style={labelStyle}><FiBookOpen size={12} style={{ display: 'inline', marginRight: '6px' }} />University</label>
              <input name="university" value={form.university} onChange={handleChange} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={labelStyle}><FiBookOpen size={12} style={{ display: 'inline', marginRight: '6px' }} />Campus</label>
              <input name="campus" value={form.campus} onChange={handleChange} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="Tell others about yourself..." style={{ ...inputStyle, resize: 'none' }} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          <div>
            <label style={labelStyle}><FiLock size={12} style={{ display: 'inline', marginRight: '6px' }} />New Password (leave blank to keep current)</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          <button
            type="submit" disabled={loading || avatarUploading}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              background: (loading || avatarUploading) ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: 'white', fontWeight: 700, fontSize: '0.95rem', border: 'none',
              cursor: (loading || avatarUploading) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: (loading || avatarUploading) ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => !(loading || avatarUploading) && (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <FiSave size={16} /> {avatarUploading ? 'Uploading photo...' : loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default SettingsPage;
