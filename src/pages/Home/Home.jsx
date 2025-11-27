import React, { useEffect, useState } from "react";
import "./home.css";
import eventApi from "../../api/eventApi";
import EventCard from "../../components/EventCard/EventCard";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await eventApi.getAllEvents();
        setEvents(res.data.events);
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) return <p className="loading">Loading events...</p>;

  const now = new Date();
  const activeEvents = events.filter(
    (e) => new Date(e.date.start) <= now && new Date(e.date.end) >= now
  );
  const upcomingEvents = events.filter((e) => new Date(e.date.start) > now);
  const completedEvents = events.filter((e) => new Date(e.date.end) < now);

  return (
    <div className="home-container">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-left">
          <h1>Discover, Register, and Host Tech Events — Effortlessly.</h1>
          <p>
            HackHub brings together the best hackathons, workshops, and contests.  
            Join events or create your own — all in one place.
          </p>

          <a className="hero-btn" href="#events">Explore Events</a>
        </div>

        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1563461660947-507ef49e9c47?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGFja2F0aG9ufGVufDB8fDB8fHww"
            alt="Hero"
          />
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section id="events">
        <h1 className="home-title">Events</h1>

        {/* Active */}
        <h2 className="section-title">🔥 Active Events</h2>
        <div className="event-grid">
          {activeEvents.length === 0 ? <p>No active events</p> :
            activeEvents.map((event) => <EventCard key={event._id} event={event} />)
          }
        </div>

        {/* Upcoming */}
        <h2 className="section-title">✨ Upcoming Events</h2>
        <div className="event-grid">
          {upcomingEvents.length === 0 ? <p>No upcoming events</p> :
            upcomingEvents.map((event) => <EventCard key={event._id} event={event} />)
          }
        </div>

        {/* Completed */}
        <h2 className="section-title">✔ Completed Events</h2>
        <div className="event-grid">
          {completedEvents.length === 0 ? <p>No completed events</p> :
            completedEvents.map((event) => <EventCard key={event._id} event={event} />)
          }
        </div>
      </section>

      
      {/* WHY SECTION */}
      <section className="why-section">
        <h2>Why HackHub?</h2>

        <div className="why-cards">
          <div className="why-card">
            <h3>🧭 Discover Events</h3>
            <p>Find hackathons, workshops, and contests happening around you.</p>
          </div>

          <div className="why-card">
            <h3>⚡ One-Click Registration</h3>
            <p>Register instantly using your profile. No repetitive forms.</p>
          </div>

          <div className="why-card">
            <h3>🚀 Host with Ease</h3>
            <p>Organizers can create events and manage registrations effortlessly.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
