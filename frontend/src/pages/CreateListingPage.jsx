import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { FiUpload, FiX } from 'react-icons/fi';

const categories = [
  'Academic & Educational',
  'Electronics & Tech',
  'Dorm & Housing',
  'Transportation',
  'Apparel & Fashion',
  'Leisure & Fitness',
  'Digital Goods',
  'Tickets & Passes',
];

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

const CreateListingPage = () => {
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - images.length);
    setImages([...images, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return setError('Please select a category');
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      images.forEach(img => formData.append('images', img));
      await api.createListing(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (e) => { e.target.style.border = '1px solid rgba(96,165,250,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.1)'; };
  const blurStyle = (e) => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', padding: 'clamp(24px,5vw,40px) 0' }}>
      <div style={{ maxWidth: '660px', margin: '0 auto', padding: '0 clamp(16px,4vw,24px)' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem,5vw,2rem)', fontWeight: 900, color: '#e2e8f0', marginBottom: 'clamp(20px,4vw,32px)' }}>Create New Listing</h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px,3vw,22px)' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: '12px', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label style={labelStyle}>Photos (Max 5)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {previews.map((p, i) => (
                <div key={i} style={{ position: 'relative', width: 'clamp(72px,18vw,88px)', height: 'clamp(72px,18vw,88px)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239,68,68,0.9)', color: 'white', width: '20px', height: '20px', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiX size={11} />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label style={{ width: 'clamp(72px,18vw,88px)', height: 'clamp(72px,18vw,88px)', borderRadius: '12px', border: '1.5px dashed rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.03)' }}
                  onMouseEnter={e => { e.currentTarget.style.border = '1.5px dashed rgba(96,165,250,0.5)'; e.currentTarget.style.background = 'rgba(96,165,250,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.border = '1.5px dashed rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  <FiUpload style={{ color: 'rgba(148,163,184,0.5)', marginBottom: '4px' }} size={18} />
                  <span style={{ fontSize: '0.7rem', color: 'rgba(148,163,184,0.5)', fontWeight: 600 }}>Upload</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              )}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="What are you selling?" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe your item, condition, etc." style={{ ...inputStyle, resize: 'none' }} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'clamp(12px,3vw,16px)' }}>
            <div>
              <label style={labelStyle}>Price (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148,163,184,0.6)', fontWeight: 700, pointerEvents: 'none' }}>₹</span>
                <input name="price" type="number" value={form.price} onChange={handleChange} required placeholder="0" style={{ ...inputStyle, paddingLeft: '32px' }} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="" style={{ background: '#0f172a' }}>Select...</option>
                {categories.map(c => <option key={c} value={c} style={{ background: '#0f172a' }}>{c}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: 'white', fontWeight: 700, fontSize: '0.95rem', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? '⏳ Uploading...' : '🚀 Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateListingPage;
