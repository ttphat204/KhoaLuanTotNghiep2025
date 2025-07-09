import React, { useState } from 'react';
import Header from './Header';
import SearchBar from '../jobs/SearchBar';
import JobList from '../jobs/JobList';

const CommonLayout = ({ children }) => {
  const [keyword, setKeyword] = useState('');
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main content with top margin for fixed header */}
      <main className="pt-16">
        {/* SearchBar component */}
        <SearchBar setKeyword={setKeyword} />
        
        {/* JobList component */}
        <JobList keyword={keyword} />
        
        {/* Additional content can be passed as children */}
        {children}
      </main>
    </div>
  );
};

export default CommonLayout; 