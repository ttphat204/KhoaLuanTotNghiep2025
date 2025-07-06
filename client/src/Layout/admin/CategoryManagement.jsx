import React, { useEffect, useState } from 'react';

const API_URL = 'https://be-khoaluan.vercel.app/api/admin/category-management';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    setCategories(data.categories || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Thêm mới
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Tên danh mục là bắt buộc');
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    if (res.ok) {
      setName(''); setDescription('');
      fetchCategories();
    } else {
      const data = await res.json();
      alert(data.message || 'Lỗi tạo danh mục');
    }
  };

  // Xóa
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa?')) return;
    const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchCategories();
    else alert('Lỗi xóa danh mục');
  };

  // Sửa
  const handleEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
    setEditDescription(cat.description || '');
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return alert('Tên danh mục là bắt buộc');
    const res = await fetch(`${API_URL}?id=${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, description: editDescription })
    });
    if (res.ok) {
      setEditId(null); setEditName(''); setEditDescription('');
      fetchCategories();
    } else {
      const data = await res.json();
      alert(data.message || 'Lỗi cập nhật danh mục');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Quản lý danh mục ngành nghề</h2>
      {/* Form thêm mới */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Tên danh mục" className="border rounded px-3 py-2 flex-1" />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả (không bắt buộc)" className="border rounded px-3 py-2 flex-1" />
        <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded">Thêm</button>
      </form>
      {/* Danh sách */}
      {loading ? <div>Đang tải...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-2">Tên danh mục</th>
              <th className="py-2 px-2">Mô tả</th>
              <th className="py-2 px-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id} className="border-t">
                <td className="py-2 px-2">
                  {editId === cat._id ? (
                    <input value={editName} onChange={e => setEditName(e.target.value)} className="border rounded px-2 py-1 w-full" />
                  ) : cat.name}
                </td>
                <td className="py-2 px-2">
                  {editId === cat._id ? (
                    <input value={editDescription} onChange={e => setEditDescription(e.target.value)} className="border rounded px-2 py-1 w-full" />
                  ) : cat.description}
                </td>
                <td className="py-2 px-2">
                  {editId === cat._id ? (
                    <>
                      <button onClick={handleUpdate} className="bg-green-600 text-white px-3 py-1 rounded mr-2">Lưu</button>
                      <button onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Hủy</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(cat)} className="bg-blue-600 text-white px-3 py-1 rounded mr-2">Sửa</button>
                      <button onClick={() => handleDelete(cat._id)} className="bg-red-600 text-white px-3 py-1 rounded">Xóa</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 