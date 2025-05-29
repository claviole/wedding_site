import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AdminMenu from "../Admin/AdminMenu";
import "./Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const [adminClicks, setAdminClicks] = useState(0);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const handleAdminClick = () => {
    setAdminClicks((prev) => prev + 1);

    // Reset after 3 seconds if not completed
    setTimeout(() => setAdminClicks(0), 3000);

    // Open admin menu after 5 clicks
    if (adminClicks >= 4) {
      setAdminMenuOpen(true);
      setAdminClicks(0);
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="site-title">Christian & Dimitra</h1>
          <nav className="navigation">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
            <Link
              to="/wedding-party"
              className={location.pathname === "/wedding-party" ? "active" : ""}
            >
              Wedding Party
            </Link>
            <Link
              to="/gallery"
              className={location.pathname === "/gallery" ? "active" : ""}
            >
              Gallery
            </Link>
            <Link
              to="/registry"
              className={location.pathname === "/registry" ? "active" : ""}
            >
              Registry
            </Link>
            <Link
              to="/faq"
              className={location.pathname === "/faq" ? "active" : ""}
            >
              FAQ
            </Link>
            <Link
              to="/rsvp"
              className={`${location.pathname === "/rsvp" ? "active" : ""} rsvp-link`}
            >
              RSVP
            </Link>
          </nav>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Christian & Dimitra</p>
          <button
            onClick={handleAdminClick}
            className="admin-access-btn"
            title={`Click ${5 - adminClicks} more times to access admin`}
          >
            {adminClicks > 0 ? `${adminClicks}/5` : "•"}
          </button>
        </div>
      </footer>

      <AdminMenu
        isOpen={adminMenuOpen}
        onClose={() => setAdminMenuOpen(false)}
      />
    </div>
  );
};

export default Layout;
