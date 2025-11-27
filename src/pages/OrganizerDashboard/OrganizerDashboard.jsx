import React, { useEffect, useState } from "react";
import "./organizerDashboard.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import eventApi from "../../api/eventApi";

const OrganizerDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Protect page
  useEffect(() => {
    if (!loading && (!user || user.role !== "organizer")) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  // Fetch organizer events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await eventApi.getOrganizerEvents();
        setEvents(res.data.events || []);
        console.log("Organizer Events:", res.data);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoadingEvents(false);
      }
    };

    if (!loading && user?.role === "organizer") {
      loadEvents();
    }
  }, [loading, user]);

  if (loading || loadingEvents)
    return <p className="loading">Loading dashboard...</p>;

  return (
    <div className="dash-container">
      <h1>Your Events</h1>

      <a href="/create-event" className="create-btn">+ Create New Event</a>

      {events.length === 0 && (
        <p className="empty-text">You haven't created any events yet.</p>
      )}

      <div className="dash-list">
        {events.map((event) => (
          <div key={event._id} className="dash-card">
            <img src={event.bannerUrl} alt="" className="dash-banner" />

            <div className="dash-info">
              <h2>{event.title}</h2>

              <p className="dash-dates">
                {new Date(event.date.start).toLocaleDateString()} -
                {new Date(event.date.end).toLocaleDateString()}
              </p>

              <p className="dash-count">
                Registrations: <b>{event.registeredCount}</b>
              </p>

              <div className="dash-btns">
                <a href={`/events/${event._id}`} className="view-btn">View</a>
                <a href={`/edit-event/${event._id}`} className="edit-btn">Edit</a>
                <button className="delete-btn" onClick={() => handleDelete(event._id)}>
                  Delete
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Delete event logic
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this event?")) return;

  try {
    await eventApi.deleteEvent(id);
    window.location.reload();
  } catch (err) {
    console.error("Delete Event Error:", err);
    alert("Failed to delete event");
  }
};

export default OrganizerDashboard;
