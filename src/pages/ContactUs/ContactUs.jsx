import React from "react";
import "./contact.css";

const ContactUs = () => {
  return (
    <div className="page-container">
      <h1>Contact Us</h1>
      <p className="desc">
        For any queries related to events, payments or technical issues, feel free to reach us.
      </p>

      <div className="box">
        <p><strong>Business Name:</strong> HackHub</p>
        <p><strong>Email:</strong> jeeva@example.com</p>
        <p><strong>Location:</strong> Tamil Nadu, India</p>
      </div>
    </div>
  );
};

export default ContactUs;
