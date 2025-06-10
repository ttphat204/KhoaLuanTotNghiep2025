import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import JobList from './components/JobList';
import SearchBar from './components/SearchBar';
import Dashboard from './components/admin/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<Dashboard />} />
        {/* Customer (user) routes */}
        <Route
          path="/*"
          element={
            <div>
              <Header />
              <div className="pt-20">
                <SearchBar />
                <JobList />
              </div>
            </div>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="colored"
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
      />
    </Router>
  );
}

export default App;
