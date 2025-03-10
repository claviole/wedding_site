import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();

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
        </div>
      </footer>
    </div>
  );
};

export default Layout;
