import { NavLink, Link } from 'react-router-dom';

const navClass = ({ isActive }) =>
  isActive ? 'nav-link active' : 'nav-link';

export default function Header() {
  return (
    <header className="header">
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>Income Tax Information Portal</span>
          <span>Professional React Website Demo</span>
        </div>
      </div>

      <div className="container navbar">
        <Link to="/" className="brand">
          <div className="brand-mark">IT</div>
          <div>
            <h1>Income Tax Portal</h1>
            <p>Government Style Professional Interface</p>
          </div>
        </Link>

        <nav className="nav-menu">
          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/about" className={navClass}>About Us</NavLink>
          <NavLink to="/acts-laws" className={navClass}>Act. & Laws</NavLink>
          <NavLink to="/tax-calculator" className={navClass}>Tax Calculator</NavLink>
          <NavLink to="/forms" className={navClass}>Income Tax Forms</NavLink>
          <NavLink to="/help" className={navClass}>Help</NavLink>
        </nav>
      </div>
    </header>
  );
}