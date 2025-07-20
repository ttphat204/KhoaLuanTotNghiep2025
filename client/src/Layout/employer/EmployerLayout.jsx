import React, { useState, useEffect } from 'react';
import { FaHome, FaBriefcase, FaFileAlt, FaSignOutAlt, FaBuilding } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EmployerDashboard from './EmployerDashboard';
import ApplicationsManager from './ApplicationsManager';
import EmployerJobManager from './EmployerJobManager';
import EmployerProfilePage from './EmployerProfilePage';

const EmployerLayout = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [companyProfile, setCompanyProfile] = useState(null);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { key: 'dashboard', icon: <FaHome />, label: 'Dashboard' },
    { key: 'jobs', icon: <FaBriefcase />, label: 'Quản lý việc làm', badge: jobsCount },
    { key: 'applications', icon: <FaFileAlt />, label: 'Đơn ứng tuyển', badge: applicationsCount },
    { key: 'profile', icon: <FaBuilding />, label: 'Thông tin' },
  ];

  // Fetch company profile để lấy logo
  useEffect(() => {
    if (user && user._id) {
      fetch(`https://be-khoaluan.vercel.app/api/employer/profile?employerId=${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setCompanyProfile(data.data);
        })
        .catch(() => setCompanyProfile(null));
    }
  }, [user]);

  // Fetch số lượng applications
  useEffect(() => {
    if (user && user._id) {
      fetch(`https://be-khoa-luan2.vercel.app/api/application/all`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setApplicationsCount(data.data?.length || 0);
          }
        })
        .catch(() => setApplicationsCount(0));
    }
  }, [user]);

  // Fetch số lượng jobs
  useEffect(() => {
    if (user && user._id) {
      fetch(`https://be-khoa-luan2.vercel.app/api/jobs/all`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setJobsCount(data.data?.length || 0);
          }
        })
        .catch(() => setJobsCount(0));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Render nội dung động theo menu
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <EmployerDashboard />;
      case 'jobs':
        return <EmployerJobManager />;
      case 'applications':
        return <ApplicationsManager />;
      case 'profile':
        return <EmployerProfilePage />;
      default:
        return <div className="p-8">Chọn chức năng bên trái để xem nội dung.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <style jsx>{`
        @keyframes gentleBounce {
          0%, 100% { transform: scale(1) translateY(0); }
          25% { transform: scale(1.05) translateY(-1px); }
          50% { transform: scale(1.08) translateY(-2px); }
          75% { transform: scale(1.05) translateY(-1px); }
        }
        
        @keyframes softGlow {
          0%, 100% { 
            box-shadow: 0 0 8px rgba(99, 102, 241, 0.2);
            filter: brightness(1);
          }
          50% { 
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.4), 0 0 30px rgba(139, 92, 246, 0.2);
            filter: brightness(1.1);
          }
        }
        
        @keyframes playfulWiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-1deg); }
          75% { transform: rotate(1deg); }
        }
        
        @keyframes attentionPulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.15);
            opacity: 0.9;
          }
        }
        
        .badge-animation {
          animation: gentleBounce 3s ease-in-out infinite, softGlow 3s ease-in-out infinite;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .badge-active {
          animation: gentleBounce 2.5s ease-in-out infinite, softGlow 2.5s ease-in-out infinite;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .badge-animation:hover {
          animation: playfulWiggle 0.6s ease-in-out infinite, attentionPulse 0.6s ease-in-out infinite;
          transform: scale(1.25) rotate(2deg);
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.6), 0 0 35px rgba(139, 92, 246, 0.3);
        }
        
        .badge-active:hover {
          animation: playfulWiggle 0.6s ease-in-out infinite, attentionPulse 0.6s ease-in-out infinite;
          transform: scale(1.25) rotate(2deg);
          box-shadow: 0 0 25px rgba(255, 255, 255, 0.4), 0 0 35px rgba(255, 255, 255, 0.2);
        }
        
        .badge-animation:active {
          animation: none;
          transform: scale(0.95);
          transition: all 0.1s ease;
        }
        
        .badge-active:active {
          animation: none;
          transform: scale(0.95);
          transition: all 0.1s ease;
        }
      `}</style>
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-2xl border-r border-gray-100 flex flex-col py-8 px-4 sticky top-0 h-screen z-20">
        {/* Logo + Company */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center mb-2 shadow-lg overflow-hidden">
            {companyProfile?.companyLogoUrl ? (
              <img 
                src={companyProfile.companyLogoUrl} 
                alt="Logo công ty" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <FaBuilding className={`text-white text-3xl ${companyProfile?.companyLogoUrl ? 'hidden' : 'flex'}`} />
          </div>
          <div className="text-center">
            <div className="text-base text-gray-700 leading-tight">Trang quản lý</div>
            <div className="text-xl font-bold text-indigo-700 leading-tight">Nhà tuyển dụng</div>
          </div>
        </div>
        {/* Menu */}
        <nav className="flex-1">
          {menuItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
              className={`w-full flex items-center justify-between px-4 py-3 my-1 rounded-lg font-medium transition-all duration-200 text-base ${activeMenu === item.key ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' : 'text-gray-700 hover:bg-indigo-50'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${activeMenu === item.key ? 'bg-white/20 text-white badge-active' : 'bg-indigo-100 text-indigo-600 badge-animation'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        {/* Logout */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 min-h-screen bg-white">
        <div className="max-w-6xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default EmployerLayout; 