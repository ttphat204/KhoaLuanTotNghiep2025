import React from 'react'

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-section-content">
        <h1>Tìm việc làm mơ ước của bạn</h1>
        <p>Hàng nghìn việc làm hấp dẫn đang chờ bạn</p>
        
        <div className="search-form">
          <div className="search-container">
            <input type="text" placeholder="Nhập từ khóa tìm kiếm..." />
            <button className="search-button">Tìm kiếm</button>
          </div>
        </div>

        <div className="popular-searches">
          <span>Tìm kiếm phổ biến:</span>
          <a href="#">Frontend Developer</a>
          <a href="#">Backend Developer</a>
          <a href="#">UI/UX Designer</a>
          <a href="#">Product Manager</a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection 