import React from 'react'
import Header from './components/layout/Header'
import HeroSection from './components/home/HeroSection'
import JobCategories from './components/home/JobCategories'
import '@/styles/main.scss'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <HeroSection />
        <JobCategories />
      </main>
    </div>
  )
}

export default App
