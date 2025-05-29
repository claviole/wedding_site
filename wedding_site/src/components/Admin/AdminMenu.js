import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminMenu.css";

const AdminMenu = ({ isOpen, onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "042217Dv!") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid password");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword("");
    setError("");
    onClose();
  };

  const handleRSVPManagement = () => {
    navigate("/admin/rsvp-management");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="admin-overlay">
      <div className="admin-modal">
        <button className="admin-close" onClick={onClose}>
          ×
        </button>

        {!isLoggedIn ? (
          <div className="admin-login">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                autoFocus
              />
              {error && <p className="admin-error">{error}</p>}
              <button type="submit" className="admin-button">
                Login
              </button>
            </form>
          </div>
        ) : (
          <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <div className="admin-buttons">
              <button className="admin-menu-button">View RSVPs</button>
              <button
                className="admin-menu-button"
                onClick={handleRSVPManagement}
              >
                RSVP Management
              </button>
              <button className="admin-logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;
