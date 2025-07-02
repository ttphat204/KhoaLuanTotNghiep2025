import React from 'react';
import { FaHome, FaUser, FaBox, FaChartBar, FaSignOutAlt, FaTags } from 'react-icons/fa';

const menu = [
  { key: 'dashboard', icon: <FaHome />, label: 'Dashboard' },
      { key: 'pendingEmployers', icon: <FaUser />, label: 'Quản lý Employer' },
  { key: 'users', icon: <FaUser />, label: 'Users' },
  { key: 'products', icon: <FaBox />, label: 'Products' },
  { key: 'reports', icon: <FaChartBar />, label: 'Reports' },
  { key: 'category', icon: <FaTags />, label: 'Category' },
];

const Sidebar = ({ active, onSelect, open }) => (
  <aside
    className={`
      ${open ? 'w-64' : 'w-20'}
      bg-gradient-to-b from-[#f6fbff] to-[#e9eafc] text-[#2563eb] flex flex-col py-8 transition-all duration-300 min-h-screen shadow-2xl rounded-tr-3xl rounded-br-3xl
    `}
  >
    <div className={`mb-10 text-2xl font-extrabold tracking-widest flex items-center ${open ? 'justify-start px-6' : 'justify-center'}`}>
      <span className="text-3xl bg-white text-[#2C3EFF] rounded-full p-2 shadow">A</span>
      {open && <span className="ml-3 text-[#2C3EFF]">ADMIN</span>}
    </div>
    <nav className="flex-1">
      {menu.map((item) => {
        const isActive = active === item.key;
        return (
          <div
            key={item.key}
            className={
              `flex items-center gap-4 py-3 px-6 rounded-lg cursor-pointer mb-2 transition-all ` +
              (isActive
                ? 'bg-white text-[#2C3EFF] shadow-lg font-bold'
                : 'hover:bg-white hover:text-[#2C3EFF] text-[#2563eb]')
            }
            style={{
              color: isActive ? '#2C3EFF' : '#2563eb',
              fontWeight: isActive ? 700 : 600,
            }}
            onClick={() => onSelect(item.key)}
          >
            <span className={`text-xl ${isActive ? 'text-[#2C3EFF]' : 'text-[#2563eb]'}`}>{item.icon}</span>
            {open && <span>{item.label}</span>}
          </div>
        );
      })}
    </nav>
    <div className="mt-auto px-6">
      <div className="flex items-center gap-4 py-3 rounded-lg hover:bg-white hover:text-[#2C3EFF] cursor-pointer transition-all text-[#2563eb]">
        <FaSignOutAlt className="text-xl" />
        {open && <span>Sign Out</span>}
      </div>
    </div>
  </aside>
);

export default Sidebar; 