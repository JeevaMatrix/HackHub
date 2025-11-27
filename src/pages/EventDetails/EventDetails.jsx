import React, { useEffect, useState } from "react";
import "./eventDetails.css";
import { useParams } from "react-router-dom";
import eventApi from "../../api/eventApi";
import { useAuth } from "../../context/AuthContext";

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await eventApi.getEventById(id);
        setEvent(res.data.event);
      } catch (err) {
        console.error("Event load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  if (loading) return <p className="loading">Loading event...</p>;
  if (!event) return <p className="error-msg">Event not found</p>;

  const now = new Date();
  const isEnded = new Date(event.date.end) < now;
  const isOrganizer = user && event.organizerId === user.id;

  const handleRegister = () => {
    if (!user) return (window.location.href = "/login");
    window.location.href = `/register/${event._id}`;
  };

  return (
    <div className="event-details-container">

      <img src={event.bannerUrl} alt="" className="event-banner" />

      <h1 className="event-title">{event.title}</h1>

      <p className="event-type-tag">{event.type}</p>

      <p className="event-dates">
        {new Date(event.date.start).toLocaleString()} - 
        {new Date(event.date.end).toLocaleString()}
      </p>

      <p className="event-venue"><b>Venue:</b> {event.venue}</p>

      {event.pricing.isPaid ? (
        <p className="event-price">₹{event.pricing.amount} / person</p>
      ) : (
        <p className="event-price free">Free</p>
      )}

      <p className="event-description">{event.description}</p>

      <div className="action-section">
        {/* If organizer */}
        {isOrganizer ? (
          <p className="info-text">You are the organizer of this event.</p>
        ) : (
          <button
            className="register-btn"
            disabled={isEnded}
            onClick={handleRegister}
          >
            {isEnded ? "Event Ended" : "Register"}
          </button>
        )}
      </div>

    </div>
  );
};

export default EventDetails;
