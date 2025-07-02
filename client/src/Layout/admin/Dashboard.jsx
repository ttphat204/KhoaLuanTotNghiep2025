import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { showSuccess, showError, showLoading, updateLoading } from '../../utils/toast.jsx';
import EmployerManagement from './EmployerManagement';

const Dashboard = () => {
  const [active, setActive] = useState('dashboard');
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = () => {
    fetch('http://localhost:3000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  };

  useEffect(() => {
    if (active === 'category') {
      fetchCategories();
    }
  }, [active]);

  const renderContent = () => {
    switch (active) {
      case 'dashboard':
        return <div className="text-2xl font-bold">Welcome to Admin Dashboard!</div>;
      case 'pendingEmployers':
        return <EmployerManagement />;
      case 'users':
        return <div className="text-2xl font-bold">User Management</div>;
      case 'products':
        return <div className="text-2xl font-bold">Product Management</div>;
      case 'reports':
        return <div className="text-2xl font-bold">Reports & Analytics</div>;
      case 'category':
        return (
          <div className="bg-white rounded-xl shadow p-6 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4 text-[#2C3EFF]">Category</h2>
            {/* Form thêm danh mục */}
            <form
              className="flex gap-2 mb-6"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newCategory.trim()) return;
                const res = await fetch('http://localhost:3000/api/categories', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: newCategory }),
                });
                if (res.ok) {
                  setNewCategory('');
                  fetchCategories();
                  showSuccess('Thêm danh mục thành công!');
                } else {
                  showError('Thêm danh mục thất bại!');
                }
              }}
            >
              <input
                type="text"
                className="flex-1 border rounded-lg px-3 py-2"
                placeholder="Tên danh mục mới"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#2C3EFF] text-white px-4 py-2 rounded-lg font-semibold"
              >
                Thêm
              </button>
            </form>
            {/* Danh sách danh mục */}
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat._id} className="flex items-center justify-between p-3 rounded bg-[#f6fbff] text-[#2C3EFF] font-semibold shadow-sm">
                  {editId === cat._id ? (
                    <>
                      <input
                        className="flex-1 border rounded-lg px-2 py-1 mr-2"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                      />
                      <button
                        className="text-green-600 font-bold mr-2"
                        onClick={async () => {
                          const res = await fetch(`http://localhost:3000/api/categories/${cat._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name: editName }),
                          });
                          setEditId(null);
                          setEditName('');
                          fetchCategories();
                          if (res.ok) {
                            showSuccess('Cập nhật danh mục thành công!');
                          } else {
                            showError('Cập nhật danh mục thất bại!');
                          }
                        }}
                      >
                        Lưu
                      </button>
                      <button
                        className="text-gray-500"
                        onClick={() => {
                          setEditId(null);
                          setEditName('');
                        }}
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{cat.name}</span>
                      <div className="flex gap-2">
                        <button
                          className="text-yellow-500 font-bold"
                          onClick={() => {
                            setEditId(cat._id);
                            setEditName(cat.name);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className="text-red-500 font-bold"
                          onClick={async () => {
                            const res = await fetch(`http://localhost:3000/api/categories/${cat._id}`, {
                              method: 'DELETE',
                            });
                            fetchCategories();
                            if (res.ok) {
                              showSuccess('Xóa danh mục thành công!');
                            } else {
                              showError('Xóa danh mục thất bại!');
                            }
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout active={active} onSelect={setActive}>
      <div className="p-8">{renderContent()}</div>
    </AdminLayout>
  );
};

export default Dashboard; 