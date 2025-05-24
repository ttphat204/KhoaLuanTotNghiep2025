import React from 'react'

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src="/logo.svg" alt="Vieclam24h" />
        </div>

        <nav className="main-nav">
          <ul>
            <li><a href="#">Trang chủ</a></li>
            <li><a href="#">Việc làm</a></li>
            <li><a href="#">Công ty</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </nav>

        <div className="auth-buttons">
          <button className="btn btn-login">Đăng nhập</button>
          <button className="btn btn-register">Đăng ký</button>
        </div>
      </div>
    </header>
  )
}

export default Header 