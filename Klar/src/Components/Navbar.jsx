import "../Style/Navbar.css"
import ThemeToggle from "./ThemeToggle"
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({ name = "KLAR", bullets = [], className = "" }) => {
  const location = useLocation();

  return (
    <nav className={`navbar-container ${className}`}>
      <div className="navbar-content">
        <div className="navbar-name">
          <Link to="/">{name}</Link>
        </div>
        <div className="navbar-items">
          {bullets.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`navbar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle className="navbar-theme-toggle" />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
