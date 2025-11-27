import React from "react";
import "./footer.css";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="footer">

      <div className="footer-top">

        {/* Branding Section */}
        <div className="footer-brand">
          <h2>HackHub</h2>
          <p>Bringing tech events closer to students.</p>
        </div>

        {/* Useful Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>

          <a href="/">Home</a>
          <a href="/events">Events</a>

          {user?.role === "organizer" && (
            <a href="/dashboard">Dashboard</a>
          )}

          {!user && (
            <>
              <a href="/login">Login</a>
              <a href="/signup">Signup</a>
            </>
          )}
        </div>

        {/* Legal Pages (Cashfree Mandatory) */}
        <div className="footer-legal">
          <h4>Legal</h4>

          <a href="/about">About</a>
          <a href="/contact">Contact Us</a>
          <a href="/terms">Terms & Conditions</a>
          <a href="/refunds">Refund & Cancellation</a>
          <a href="/shipping">Shipping Policy</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} HackHub • All rights reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;
