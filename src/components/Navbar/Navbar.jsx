import React, { useState } from "react";
import "./navbar.css";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      {/* Logo */}
      <a href="/" className="navbar-logo">HackHub</a>

      {/* Right controls */}
      <div className="navbar-right">

        {!user && (
          <a href="/login" className="nav-btn login-btn">Login</a>
        )}

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>

        {!user && (
          <a href="/signup" className="mobile-link">Signup</a>
        )}

        {user?.role === "student" && (
          <>
            <a href="/my-registrations" className="mobile-link">My Registrations</a>
            <button onClick={logout} className="mobile-logout">Logout</button>
          </>
        )}

        {user?.role === "organizer" && (
          <>
            <a href="/dashboard" className="mobile-link">Dashboard</a>
            <a href="/create-event" className="mobile-link">Create Event</a>
            <button onClick={logout} className="mobile-logout">Logout</button>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
