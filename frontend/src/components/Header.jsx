import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="site-header">
      <Link to="/" className="brand">
        Ledger<span className="brand-mark">.</span>
      </Link>
      <nav className="header-nav">
        {user ? (
          <>
            <Link to="/new">New entry</Link>
            <span className="header-user">{user.username}</span>
            <button className="link-btn" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}
