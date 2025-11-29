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
  const isOrganizer = user && event.organizerId === user._id;

  const handleRegister = () => {
    if (!user) return (window.location.href = "/login");
    window.location.href = `/register/${event._id}`;
  };

  // CSV Download Function
  const handleCSVDownload = async () => {
    try {
      const res = await eventApi.downloadRegistrationsCSV(event._id);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.download = `${event.title.replace(/\s+/g, "_")}_registrations.csv`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV Download Error:", err);
    }
  };

  // Share Function
  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: "Check out this event!",
          url: shareUrl
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Event link copied to clipboard!");
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
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

      {/* Brochure */}
      {/* 🔽 DOWNLOAD BROCHURE BUTTON */}
      {event.brochureUrl && (
        <div className="brochure-section">
          <a
            href={`${event.brochureUrl}?fl_attachment=${event.title.replace(/\s+/g, "_")}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="download-btn"
          >
            📄 Get Brochure (PDF)
          </a>
        </div>
      )}

      {/* CSV Download */}
      {isOrganizer && (
        <button onClick={handleCSVDownload} className="download-btn">
          📥 Download Registrations (CSV)
        </button>
      )}

      {/* Share */}
      <button onClick={handleShare} className="share-btn">
        🔗 Share Event
      </button>

      {/* Register */}
      <div className="action-section">
        {isOrganizer ? (
          <div>
            <p className="info-text">You are the organizer of this event.</p>
            <p>Students count: {event.registeredCount}</p>
          </div>
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
