import React from 'react';
import Header from './Header';
import SearchBar from '../jobs/SearchBar';
import JobList from '../jobs/JobList';

const CommonLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main content with top margin for fixed header */}
      <main className="pt-16">
        {/* SearchBar component */}
        <SearchBar />
        
        {/* JobList component */}
        <JobList />
        
        {/* Additional content can be passed as children */}
        {children}
      </main>
    </div>
  );
};

export default CommonLayout; 