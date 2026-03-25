import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { FiUpload, FiX, FiSave, FiTrash2 } from 'react-icons/fi';

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

const EditListingPage = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await api.getListingById(id);
        setForm({ title: data.title, description: data.description, price: data.price, category: data.category });
        setExistingImages(data.images || []);
      } catch (err) {
        setError('Failed to load listing');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - existingImages.length - newImages.length);
    setNewImages([...newImages, ...files]);
    setNewPreviews([...newPreviews, ...files.map(f => URL.createObjectURL(f))]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      newImages.forEach(img => formData.append('images', img));
      await api.updateListing(id, formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.deleteListing(id);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete listing');
    }
  };

  const focusStyle = (e) => { e.target.style.border = '1px solid rgba(96,165,250,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.1)'; };
  const blurStyle = (e) => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1e' }}>
      <div style={{ width: '44px', height: '44px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', padding: 'clamp(24px,5vw,40px) 0' }}>
      <div style={{ maxWidth: '660px', margin: '0 auto', padding: '0 clamp(16px,4vw,24px)' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem,5vw,2rem)', fontWeight: 900, color: '#e2e8f0', marginBottom: 'clamp(20px,4vw,32px)' }}>Edit Listing</h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px,3vw,22px)' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: '12px', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {/* Images */}
          <div>
            <label style={labelStyle}>Photos</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {existingImages.map((img, i) => (
                <div key={i} style={{ width: 'clamp(72px,18vw,88px)', height: 'clamp(72px,18vw,88px)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
              {newPreviews.map((p, i) => (
                <div key={`new-${i}`} style={{ position: 'relative', width: 'clamp(72px,18vw,88px)', height: 'clamp(72px,18vw,88px)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(96,165,250,0.3)' }}>
                  <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => { setNewImages(newImages.filter((_, j) => j !== i)); setNewPreviews(newPreviews.filter((_, j) => j !== i)); }} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239,68,68,0.9)', color: 'white', width: '20px', height: '20px', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiX size={11} />
                  </button>
                </div>
              ))}
              {existingImages.length + newImages.length < 5 && (
                <label style={{ width: 'clamp(72px,18vw,88px)', height: 'clamp(72px,18vw,88px)', borderRadius: '12px', border: '1.5px dashed rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.03)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.border = '1.5px dashed rgba(96,165,250,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.border = '1.5px dashed rgba(255,255,255,0.15)'; }}
                >
                  <FiUpload style={{ color: 'rgba(148,163,184,0.5)', marginBottom: '4px' }} size={18} />
                  <span style={{ fontSize: '0.7rem', color: 'rgba(148,163,184,0.5)', fontWeight: 600 }}>Add</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              )}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4} style={{ ...inputStyle, resize: 'none' }} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'clamp(12px,3vw,16px)' }}>
            <div>
              <label style={labelStyle}>Price (₹)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                {categories.map(c => <option key={c} value={c} style={{ background: '#0f172a' }}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'clamp(10px,2vw,14px)', flexWrap: 'wrap' }}>
            <button type="submit" disabled={saving} style={{ flex: 1, minWidth: '140px', padding: '14px', borderRadius: '12px', background: saving ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: saving ? 'none' : '0 8px 24px rgba(99,102,241,0.3)', transition: 'all 0.2s' }}>
              <FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={handleDelete} style={{ padding: '14px 20px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontWeight: 700, fontSize: '0.95rem', border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            >
              <FiTrash2 size={16} /> Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditListingPage;
