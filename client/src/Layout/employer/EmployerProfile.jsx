import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const EmployerProfile = ({ onSuccess }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      fetch(`https://be-khoaluan.vercel.app/api/employer/profile?employerId=${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setProfile(data.data);
            setForm(data.data);
            setLogoPreview(data.data.companyLogoUrl || '');
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'companyLogoUrl') {
      setLogoPreview(e.target.value);
    }
  };

  const handleLogoFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      // Chuyển file thành base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setForm(f => ({ ...f, companyLogoUrl: base64String }));
        setLogoPreview(base64String);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setMessage('Lỗi xử lý file!');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('https://be-khoaluan.vercel.app/api/employer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employerId: user._id, ...form })
    });
    const data = await res.json();
    if (data.success) {
      setMessage('Cập nhật thành công!');
      setProfile(data.data);
      setTimeout(() => {
        setMessage('');
        if (onSuccess) onSuccess();
      }, 1000);
    } else {
      setMessage(data.message || 'Có lỗi xảy ra!');
    }
  };

  if (loading) return <div>Đang tải thông tin...</div>;
  if (!profile) return <div>Không tìm thấy thông tin employer.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <h2 className="text-2xl font-bold mb-4">Cập nhật thông tin công ty</h2>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Tên công ty *</label>
          <input name="companyName" value={form.companyName || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email công ty</label>
          <input name="companyEmail" value={form.companyEmail || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Số điện thoại</label>
          <input name="companyPhoneNumber" value={form.companyPhoneNumber || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Địa chỉ</label>
          <input name="companyAddress" value={form.companyAddress || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Website</label>
          <input name="companyWebsite" value={form.companyWebsite || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Mô tả công ty</label>
          <textarea name="companyDescription" value={form.companyDescription || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Logo công ty</label>
          <input
            type="text"
            name="companyLogoUrl"
            value={form.companyLogoUrl || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="Dán link ảnh hoặc chọn file bên dưới"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoFile}
            className="mb-2"
            disabled={uploading}
          />
          {logoPreview && (
            <img src={logoPreview} alt="Logo preview" className="h-16 mt-2 rounded border" />
          )}
        </div>
        <button type="submit" className="bg-purple-700 text-white px-6 py-2 rounded font-semibold" disabled={uploading}>Cập nhật</button>
      </form>
    </div>
  );
};

export default EmployerProfile; 