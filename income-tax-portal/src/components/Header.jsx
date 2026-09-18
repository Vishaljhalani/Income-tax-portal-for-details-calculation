import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo.png";

const navClass = ({ isActive }) =>
  isActive ? "nav-link active" : "nav-link";

export default function Header() {
  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .header {
          width: 100%;
          background: #020617;
          color: #f8fafc;
          border-bottom: 1px solid rgba(148, 163, 184, 0.15);
          position: relative;
          z-index: 1000;
        }

        /* ================================
           TOP STRIP
        ================================= */

        .top-strip {
          width: 100%;
          background:
            linear-gradient(
              90deg,
              rgba(15, 23, 42, 0.98),
              rgba(30, 41, 59, 0.96)
            );
          border-bottom: 1px solid rgba(148, 163, 184, 0.12);
        }

        .top-strip-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 8px 28px;
          min-height: 34px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          font-size: 12px;
          color: #94a3b8;
          letter-spacing: 0.2px;
        }

        /* ================================
           MAIN NAVBAR
        ================================= */

        .navbar {
          max-width: 1400px;
          margin: 0 auto;
          min-height: 82px;
          padding: 14px 28px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        /* ================================
           BRAND
        ================================= */
        .logo {
          background: white;
          border-radius: 20px
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 13px;

          text-decoration: none;
          color: inherit;

          min-width: 250px;
        }

        .brand-logo {
          width: 54px;
          height: 54px;

          object-fit: contain;
          display: block;
          flex-shrink: 0;

          border-radius: 12px;
        }

        .brand-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .brand-content h1 {
          margin: 0;

          font-size: 20px;
          line-height: 1.2;
          font-weight: 800;

          color: #f8fafc;
          letter-spacing: -0.3px;
        }

        .brand-content p {
          margin: 4px 0 0;

          font-size: 11px;
          line-height: 1.3;

          color: #94a3b8;
          font-weight: 500;
        }

        /* ================================
           NAVIGATION
        ================================= */

        .nav-menu {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          gap: 5px;
          flex-wrap: wrap;
        }

        .nav-link {
          position: relative;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 42px;
          padding: 10px 15px;

          color: #cbd5e1;
          text-decoration: none;

          font-size: 14px;
          font-weight: 600;

          border-radius: 11px;

          transition:
            color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .nav-link:hover {
          color: #ffffff;
          background: rgba(51, 65, 85, 0.55);
        }

        .nav-link.active {
          color: #ffffff;
          background:
            linear-gradient(
              135deg,
              rgba(37, 99, 235, 0.9),
              rgba(59, 130, 246, 0.75)
            );

          box-shadow:
            0 6px 18px rgba(37, 99, 235, 0.22);
        }

        .nav-link.active:hover {
          background:
            linear-gradient(
              135deg,
              rgba(37, 99, 235, 1),
              rgba(59, 130, 246, 0.9)
            );
        }

        /* ================================
           TABLET
        ================================= */

        @media (max-width: 1100px) {
          .navbar {
            gap: 18px;
          }

          .brand {
            min-width: auto;
          }

          .brand-content h1 {
            font-size: 18px;
          }

          .brand-content p {
            font-size: 10px;
          }

          .nav-link {
            padding: 9px 11px;
            font-size: 13px;
          }
        }

        /* ================================
           MOBILE
        ================================= */

        @media (max-width: 800px) {
          .top-strip-inner {
            padding: 7px 18px;
            gap: 10px;
          }

          .top-strip-inner span:last-child {
            display: none;
          }

          .navbar {
            padding: 14px 18px;
            min-height: auto;

            flex-direction: column;
            align-items: stretch;
            gap: 14px;
          }

          .brand {
            justify-content: center;
          }

          .nav-menu {
            width: 100%;
            justify-content: center;
            gap: 5px;
          }

          .nav-link {
            min-height: 38px;
            padding: 8px 10px;
            font-size: 12px;
          }
        }

        /* ================================
           SMALL MOBILE
        ================================= */

        @media (max-width: 520px) {
          .top-strip-inner {
            justify-content: center;
            padding: 6px 12px;
          }

          .top-strip-inner span:first-child {
            font-size: 11px;
          }

          .navbar {
            padding: 12px;
          }

          .brand {
            justify-content: flex-start;
          }

          .brand-logo {
            width: 46px;
            height: 46px;
          }

          .brand-content h1 {
            font-size: 17px;
          }

          .brand-content p {
            font-size: 9px;
          }

          .nav-menu {
            justify-content: flex-start;

            overflow-x: auto;
            flex-wrap: nowrap;

            padding-bottom: 3px;

            scrollbar-width: thin;
          }

          .nav-menu::-webkit-scrollbar {
            height: 4px;
          }

          .nav-link {
            flex-shrink: 0;
            min-height: 36px;

            padding: 8px 11px;

            font-size: 12px;
          }
        }
      `}</style>

      <header className="header">

        {/* TOP STRIP */}
        <div className="top-strip">
          <div className="container top-strip-inner">
            <span>
              Income Tax Information Portal
            </span>

            <span>
              Professional React Website Demo
            </span>
          </div>
        </div>

        {/* MAIN NAVBAR */}
        <div className="container navbar">

          {/* BRAND */}
          <Link
            to="/"
            className="brand"
          >
            <div className="logo">
              <img
              src={logo}
              alt="Income Tax Portal Logo"
              className="brand-logo"
            />
            </div>

            <div className="brand-content">
              <h1>
                Income Tax Portal
              </h1>

              <p>
                Government Style Professional Interface
              </p>
            </div>
          </Link>

          {/* NAVIGATION */}
          <nav className="nav-menu">

            <NavLink
              to="/"
              className={navClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={navClass}
            >
              About Us
            </NavLink>

            <NavLink
              to="/acts-laws"
              className={navClass}
            >
              Act. & Laws
            </NavLink>

            <NavLink
              to="/tax-calculator"
              className={navClass}
            >
              Tax Calculator
            </NavLink>

            <NavLink
              to="/forms"
              className={navClass}
            >
              Income Tax Forms
            </NavLink>

            <NavLink
              to="/help"
              className={navClass}
            >
              Help
            </NavLink>

          </nav>
        </div>
      </header>
    </>
  );
}