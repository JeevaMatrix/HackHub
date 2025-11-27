import React, { useEffect, useState } from "react";
import "./registerEvent.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import eventApi from "../../api/eventApi";
import registrationApi from "../../api/registrationApi";
import paymentApi from "../../api/paymentApi";
// import { Cashfree } from "cashfree-dropjs";

const RegisterEvent = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, [user, navigate]);

  // Fetch event details
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await eventApi.getEventById(id);
        setEvent(res.data.event);
      } catch (err) {
        console.error("Fetch event error:", err);
        setError("Event not found");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  // FREE registration logic
  const handleFreeRegistration = async () => {
    setProcessing(true);
    setError("");

    try {
      await registrationApi.register(id);
      navigate("/my-registrations");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setProcessing(false);
    }
  };

  // PAID registration logic
  const handlePaidRegistration = async () => {
    setProcessing(true);
    setError("");

    try {
      // Create order on backend
      const res = await paymentApi.createOrder({ eventId: id });
      const sessionId = res.data.payment_session_id;

      // Initialize Cashfree SDK (NO "new")
      const cashfree = window.Cashfree({ mode: "sandbox" });

      // Open payment gateway
      cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: "_self"
      });

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Payment initiation failed");
      setProcessing(false);
    }
  };

  const handleRegister = () => {
    if (event.pricing.isPaid) handlePaidRegistration();
    else handleFreeRegistration();
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!event) return <p className="error-msg">Event not found</p>;

  const now = new Date();
  const eventEnded = new Date(event.date.end) < now;

  return (
    <div className="reg-container">
      <h1>Register for {event.title}</h1>

      <p className="reg-dates">
        {new Date(event.date.start).toLocaleString()} –{" "}
        {new Date(event.date.end).toLocaleString()}
      </p>

      <p className="reg-price">
        {event.pricing.isPaid
          ? `Entry Fee: ₹${event.pricing.amount}`
          : "Free Event"}
      </p>

      <p className="reg-description">{event.description}</p>

      {error && <p className="error-msg">{error}</p>}

      <button
        className="reg-btn"
        disabled={processing || eventEnded}
        onClick={handleRegister}
      >
        {eventEnded
          ? "Event Ended"
          : processing
          ? "Processing..."
          : event.pricing.isPaid
          ? "Pay & Register"
          : "Register"}
      </button>
    </div>
  );
};

export default RegisterEvent;
