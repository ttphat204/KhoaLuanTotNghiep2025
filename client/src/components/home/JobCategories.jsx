import React from 'react'

const JobCategories = () => {
  const categories = [
    {
      id: 1,
      title: 'Công nghệ thông tin',
      icon: '💻',
      count: '2,500+'
    },
    {
      id: 2,
      title: 'Marketing',
      icon: '📢',
      count: '1,200+'
    },
    {
      id: 3,
      title: 'Kinh doanh',
      icon: '💼',
      count: '3,000+'
    },
    {
      id: 4,
      title: 'Tài chính',
      icon: '💰',
      count: '1,800+'
    }
  ]

  return (
    <section className="job-categories">
      <h2>Khám phá việc làm theo ngành nghề</h2>
      
      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <div className="category-icon">{category.icon}</div>
            <h3>{category.title}</h3>
            <p>{category.count} việc làm</p>
          </div>
        ))}
      </div>

      <div className="view-all">
        <a href="#" className="view-all-link">Xem tất cả ngành nghề</a>
      </div>
    </section>
  )
}

export default JobCategories 