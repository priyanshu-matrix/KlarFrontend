import "../Style/Navbar.css"
import ThemeToggle from "./ThemeToggle"

const Navbar = ({ name = "KLAR", bullets = [], className = "", useRouter = false }) => {
  const handleNavigation = (path, onClick) => {
    if (onClick && typeof onClick === 'function') {
      onClick();
    } else if (path) {
      if (useRouter) {
        // For future React Router integration
        // navigate(path);
        console.log('Navigate to:', path);
      } else {
        window.location.href = path;
      }
    }
  };

  return (
    <nav className={`navbar-container ${className}`}>
      <div className="navbar-content">
        <div className="navbar-name">
          {name}
        </div>
        <div className="navbar-items">
          {bullets.map((item, index) => (
            <button
              key={index}
              className="navbar-item"
              onClick={() => handleNavigation(item.path, item.onClick)}
            >
              {item.label}
            </button>
          ))}
          <ThemeToggle className="navbar-theme-toggle" />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
