import React, { useState, useEffect } from "react";
import "./createEvent.css";
import eventApi from "../../api/eventApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Protect route (organizers only)
  useEffect(() => {
    if (!loading && (!user || user.role !== "organizer")) {
      navigate("/login");
    }
  }, [loading, user, navigate]);


  const [form, setForm] = useState({
    title: "",
    description: "",
    bannerUrl: "",
    type: "hackathon",
    visibility: "public",
    allowedCollegeIds: [],
    startDate: "",
    endDate: "",
    venue: "",
    isPaid: false,
    amount: 0,
    currency: "INR",
    earlyBirdEnabled: false,
    earlyBirdAmount: 0,
    earlyBirdEnd: "",
    registrationLimit: 0,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        bannerUrl: form.bannerUrl,
        type: form.type,
        visibility: form.visibility,
        allowedCollegeIds:
          form.visibility === "private" ? form.allowedCollegeIds : [],

        date: {
          start: form.startDate,
          end: form.endDate,
        },

        venue: form.venue,

        pricing: {
          isPaid: form.isPaid,
          amount: form.isPaid ? form.amount : 0,
          currency: form.currency,
          earlyBird: {
            enabled: form.earlyBirdEnabled,
            amount: form.earlyBirdAmount,
            endDate: form.earlyBirdEnd || null,
          },
        },

        registrationLimit: form.registrationLimit,
      };

      const res = await eventApi.createEvent(payload);

      setSuccess("Event created successfully!");
      setTimeout(() => navigate("/dashboard"), 1200);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create event");
    }
  };

  if (loading) return <p className="loading">Checking login...</p>;

  return (
    <div className="create-container">
      <h1>Create Event</h1>

      <form className="create-form" onSubmit={handleSubmit}>

        {/* Title */}
        <label>Event Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        ></textarea>

        {/* Banner */}
        <label>Banner Image URL</label>
        <input
          name="bannerUrl"
          value={form.bannerUrl}
          onChange={handleChange}
        />

        {/* Event Type */}
        <label>Event Type</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="hackathon">Hackathon</option>
          <option value="workshop">Workshop</option>
          <option value="contest">Contest</option>
        </select>

        {/* Visibility */}
        <label>Visibility</label>
        <select name="visibility" value={form.visibility} onChange={handleChange}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        {/* Allowed Colleges (for private events) */}
        {form.visibility === "private" && (
          <>
            <label>Allowed Colleges (IDs comma-separated)</label>
            <input
              name="allowedCollegeIds"
              value={form.allowedCollegeIds}
              onChange={(e) =>
                setForm({
                  ...form,
                  allowedCollegeIds: e.target.value.split(",").map((v) => v.trim()),
                })
              }
            />
          </>
        )}

        {/* Dates */}
        <label>Start Date</label>
        <input
          type="datetime-local"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
        />

        <label>End Date</label>
        <input
          type="datetime-local"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          required
        />

        {/* Venue */}
        <label>Venue</label>
        <input
          name="venue"
          value={form.venue}
          onChange={handleChange}
        />

        {/* Pricing */}
        <label>
          <input
            type="checkbox"
            name="isPaid"
            checked={form.isPaid}
            onChange={handleCheckbox}
          />
          Paid Event
        </label>

        {form.isPaid && (
          <>
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
            />

            <label>Currency</label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>

            <label>
              <input
                type="checkbox"
                name="earlyBirdEnabled"
                checked={form.earlyBirdEnabled}
                onChange={handleCheckbox}
              />
              Early Bird Discount
            </label>

            {form.earlyBirdEnabled && (
              <>
                <label>Early Bird Amount</label>
                <input
                  type="number"
                  name="earlyBirdAmount"
                  value={form.earlyBirdAmount}
                  onChange={handleChange}
                />

                <label>Early Bird End Date</label>
                <input
                  type="datetime-local"
                  name="earlyBirdEnd"
                  value={form.earlyBirdEnd}
                  onChange={handleChange}
                />
              </>
            )}
          </>
        )}

        {/* Registration Limit */}
        <label>Registration Limit (0 = unlimited)</label>
        <input
          type="number"
          name="registrationLimit"
          value={form.registrationLimit}
          onChange={handleChange}
        />

        {/* Messages */}
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        {/* Submit */}
        <button type="submit" className="create-btn">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
