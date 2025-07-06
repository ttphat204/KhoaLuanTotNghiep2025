import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { showSuccess, showError, showLoading, updateLoading } from '../../utils/toast.jsx';
import EmployerManagement from './EmployerManagement';
import CategoryManagement from './CategoryManagement';

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
        return <CategoryManagement />;
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