import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import JobList from './components/JobList'
import './App.css'

function App() {
  const [filters, setFilters] = useState({
    industry: '',
    location: '',
    workType: '',
    salary: ''
  })

  return (
    <div className="min-h-screen bg-[#f6fbff]">
      <Header />
      <main>
        <SearchBar />
        <JobList filters={filters} />
      </main>
      <footer className="bg-white border-t mt-12 py-6">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>© 2024 JobFinder. All rights reserved.</p>
            <p className="mt-2">Powered by React & Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
