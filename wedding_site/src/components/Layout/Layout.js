import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import AdminMenu from "../Admin/AdminMenu";
import "./Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const [adminClicks, setAdminClicks] = useState(0);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileNavRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    // Return focus to the menu button when closing
    if (mobileMenuBtnRef.current) {
      mobileMenuBtnRef.current.focus();
    }
  };

  // Handle focus management and body scroll lock
  useEffect(() => {
    if (mobileMenuOpen) {
      // Lock body scroll when menu is open
      document.body.style.overflow = "hidden";

      // Focus the mobile nav container
      if (mobileNavRef.current) {
        mobileNavRef.current.focus();
      }
    } else {
      // Restore body scroll when menu is closed
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="site-title">Christian & Dimitra</h1>

          {/* Desktop Navigation */}
          <nav className="navigation desktop-nav">
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

          {/* Mobile Menu Button */}
          <button
            ref={mobileMenuBtnRef}
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label={
              mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav
          ref={mobileNavRef}
          id="mobile-navigation"
          className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}
          tabIndex={-1}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="mobile-nav-content">
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
              onClick={closeMobileMenu}
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              Home
            </Link>
            <Link
              to="/wedding-party"
              className={location.pathname === "/wedding-party" ? "active" : ""}
              onClick={closeMobileMenu}
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              Wedding Party
            </Link>
            <Link
              to="/gallery"
              className={location.pathname === "/gallery" ? "active" : ""}
              onClick={closeMobileMenu}
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              Gallery
            </Link>
            <Link
              to="/registry"
              className={location.pathname === "/registry" ? "active" : ""}
              onClick={closeMobileMenu}
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              Registry
            </Link>
            <Link
              to="/faq"
              className={location.pathname === "/faq" ? "active" : ""}
              onClick={closeMobileMenu}
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              FAQ
            </Link>
            <Link
              to="/rsvp"
              className={`${location.pathname === "/rsvp" ? "active" : ""} rsvp-link`}
              onClick={closeMobileMenu}
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              RSVP
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu-overlay"
            onClick={closeMobileMenu}
            aria-hidden="true"
          ></div>
        )}
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
