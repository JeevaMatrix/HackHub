import React, { useEffect, useState } from "react";
import "./myRegistrations.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import registrationApi from "../../api/registrationApi";

const MyRegistrations = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Protect page with loading guard
  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await registrationApi.myRegistrations();
        setRegistrations(res.data || []);
      } catch (err) {
        console.error("Load registrations error:", err);
      } finally {
        setLoadingData(false);
      }
    };

    if (!loading && user) {
      loadData();
    }
  }, [loading, user]);

  if (loading || loadingData) return <p className="loading">Loading your registrations...</p>;

  return (
    <div className="reglist-container">
      <h1>Your Registrations</h1>

      {registrations.length === 0 && (
        <p className="empty-text">You haven't registered for any events yet.</p>
      )}

      <div className="reglist">
        {registrations.map((reg) => (
          <div key={reg._id} className="reg-card">
            
            <img src={reg.eventId.bannerUrl} className="reg-banner" alt="" />

            <div className="reg-info">
              <h2>{reg.eventId.title}</h2>

              <p className="reg-dates">
                {new Date(reg.eventId.date.start).toLocaleDateString()} -
                {new Date(reg.eventId.date.end).toLocaleDateString()}
              </p>

              <p className="reg-status">
                Status: <b>{reg.status}</b>
              </p>

              <p className="reg-status">
                Payment: <b>{reg.paymentStatus}</b>
              </p>

              <a href={`/events/${reg.eventId._id}`} className="details-btn">
                View Event
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRegistrations;
