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
      
      <main className="pt-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SearchBar />
          </motion.div>

          <div className="mt-8">
            <JobList filters={filters} />
          </div>

          <div className="mt-8">
          </div>
        </div>
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
