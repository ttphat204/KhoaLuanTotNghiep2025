import React, { useEffect, useState } from 'react';
import { showSuccess, showError, showInfo } from '../../utils/toast';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaTags } from 'react-icons/fa';

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
    try {
      showInfo('Đang tải danh sách danh mục...');
      const res = await fetch(API_URL);
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('Lỗi khi tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Thêm mới
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showError('Tên danh mục là bắt buộc');
      return;
    }
    
    try {
      showInfo('Đang tạo danh mục mới...');
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      
      if (res.ok) {
        showSuccess('✅ Tạo danh mục thành công!', 'Danh mục đã được thêm vào hệ thống.');
        setName('');
        setDescription('');
        fetchCategories();
      } else {
        const data = await res.json();
        showError(data.message || 'Lỗi tạo danh mục');
      }
    } catch (error) {
      showError('Lỗi kết nối server! Vui lòng thử lại sau.');
    }
  };

  // Xóa
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa danh mục này?')) return;
    
    try {
      showInfo('Đang xóa danh mục...');
      const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        showSuccess('🗑️ Xóa danh mục thành công!', 'Danh mục đã được xóa khỏi hệ thống.');
        fetchCategories();
      } else {
        showError('Lỗi xóa danh mục');
      }
    } catch (error) {
      showError('Lỗi kết nối server! Vui lòng thử lại sau.');
    }
  };

  // Sửa
  const handleEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
    setEditDescription(cat.description || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      showError('Tên danh mục là bắt buộc');
      return;
    }
    
    try {
      showInfo('Đang cập nhật danh mục...');
      const res = await fetch(`${API_URL}?id=${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, description: editDescription })
      });
      
      if (res.ok) {
        showSuccess('✅ Cập nhật danh mục thành công!', 'Thông tin danh mục đã được cập nhật.');
        setEditId(null);
        setEditName('');
        setEditDescription('');
        fetchCategories();
      } else {
        const data = await res.json();
        showError(data.message || 'Lỗi cập nhật danh mục');
      }
    } catch (error) {
      showError('Lỗi kết nối server! Vui lòng thử lại sau.');
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
    setEditDescription('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FaTags className="text-2xl text-indigo-500" />
        <h2 className="text-2xl font-bold text-gray-800">Quản lý danh mục ngành nghề</h2>
      </div>

      {/* Form thêm mới */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaPlus className="text-green-500" />
          Thêm danh mục mới
        </h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Tên danh mục *" 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
          />
          <input 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Mô tả (không bắt buộc)" 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
          />
          <button 
            type="submit" 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <FaPlus />
            Thêm danh mục
          </button>
        </form>
      </div>

      {/* Danh sách */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Danh sách danh mục ({categories.length})</h3>
        </div>
        
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <FaTags className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có danh mục nào</h3>
            <p className="text-gray-500">Hãy thêm danh mục đầu tiên để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map(cat => (
                  <tr key={cat._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {editId === cat._id ? (
                        <input 
                          value={editName} 
                          onChange={e => setEditName(e.target.value)} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaTags className="text-indigo-500" />
                          <span className="font-medium text-gray-900">{cat.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editId === cat._id ? (
                        <input 
                          value={editDescription} 
                          onChange={e => setEditDescription(e.target.value)} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                      ) : (
                        <span className="text-gray-600">{cat.description || 'Chưa có mô tả'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editId === cat._id ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={handleUpdate} 
                            className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                          >
                            <FaSave className="text-sm" />
                            Lưu
                          </button>
                          <button 
                            onClick={cancelEdit} 
                            className="bg-gray-400 text-white px-3 py-1.5 rounded-lg hover:bg-gray-500 transition-colors flex items-center gap-1"
                          >
                            <FaTimes className="text-sm" />
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEdit(cat)} 
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                          >
                            <FaEdit className="text-sm" />
                            Sửa
                          </button>
                          <button 
                            onClick={() => handleDelete(cat._id)} 
                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
                          >
                            <FaTrash className="text-sm" />
                            Xóa
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 