import React from "react";
import "./eventCard.css";

const EventCard = ({ event }) => {
  return (
    <a className="event-card" href={`/events/${event._id}`}>
      <img src={event.bannerUrl} alt="" className="event-banner" />

      <h3>{event.title}</h3>
      <p className="event-date">
        {new Date(event.date.start).toLocaleDateString()}
        {" - "}
        {new Date(event.date.end).toLocaleDateString()}
      </p>

      {event.pricing?.isPaid ? (
        <span className="paid-tag">Paid ₹{event.pricing.amount}</span>
      ) : (
        <span className="free-tag">Free</span>
      )}
    </a>
  );
};

export default EventCard;
