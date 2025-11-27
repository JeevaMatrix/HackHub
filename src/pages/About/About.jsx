import React from "react";
import "./about.css";

const About = () => {
  return (
    <div className="page-container">
      <h1>About HackHub</h1>

      <p>
        HackHub is an online event management platform designed for colleges, organizers, and
        students. Our goal is to make registrations simple, fast, and reliable.
      </p>

      <h3>What We Offer</h3>
      <ul>
        <li>Event hosting for organizers</li>
        <li>Student registrations</li>
        <li>Payment handling via Cashfree</li>
        <li>Organizer dashboards</li>
        <li>Automated notifications</li>
      </ul>

      <h3>Why HackHub?</h3>
      <p>
        HackHub removes the complexity of managing registrations, collecting payments, and tracking
        participants. Everything happens online, securely.
      </p>
    </div>
  );
};

export default About;
