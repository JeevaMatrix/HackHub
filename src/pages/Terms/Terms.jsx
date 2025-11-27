import React from "react";
import "./terms.css";

const Terms = () => {
  return (
    <div className="page-container">
      <h1>Terms and Conditions</h1>

      <p>
        Welcome to <strong>HackHub</strong>, an online platform that enables organizers to host
        events and allows students to register for them.
      </p>

      <h3>Use of the Website</h3>
      <p>
        By accessing or using HackHub, you agree to follow all rules and guidelines related to
        event participation and registration.
      </p>

      <h3>Payments</h3>
      <p>
        All payments made on this platform are securely processed via Cashfree Payment Gateway.
      </p>

      <h3>User Responsibilities</h3>
      <p>
        Users must provide accurate information. HackHub is not responsible for false data submitted
        during registrations or event listings.
      </p>

      <h3>Service Description</h3>
      <p>
        HackHub provides digital services only, specifically event listing, student registrations,
        and organizer dashboards.
      </p>
    </div>
  );
};

export default Terms;
