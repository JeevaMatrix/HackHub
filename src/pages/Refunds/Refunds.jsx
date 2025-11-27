import React from "react";
import "./refunds.css";

const Refunds = () => {
  return (
    <div className="page-container">
      <h1>Refunds and Cancellation Policy</h1>

      <h3>Event Registration Refunds</h3>
      <p>
        Refunds for event registrations are handled directly by the event organizers.
        HackHub is a platform provider and does not issue refunds directly.
      </p>

      <h3>Organizer Responsibilities</h3>
      <p>
        Organizers must clearly mention if their event supports refunds and the time window
        in which users can apply.
      </p>

      <h3>Platform Policy</h3>
      <p>
        Since HackHub is only a facilitator between organizers and participants, all disputes
        or refund-related concerns must be addressed to the respective organizer.
      </p>
    </div>
  );
};

export default Refunds;
