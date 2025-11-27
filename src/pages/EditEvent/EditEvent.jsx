import React, { useEffect, useState } from "react";
import "./editEvent.css";
import eventApi from "../../api/eventApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams(); // event id
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Protect route — Only organizer allowed
  useEffect(() => {
    if (!loading && (!user || user.role !== "organizer")) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  const [loadingEvent, setLoadingEvent] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  // Load event data
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await eventApi.getEventById(id);
        const event = res.data.event;

        setForm({
          title: event.title,
          description: event.description || "",
          bannerUrl: event.bannerUrl || "",
          type: event.type,
          visibility: event.visibility,
          allowedCollegeIds: event.allowedCollegeIds || [],
          startDate: event.date.start.slice(0, 16),
          endDate: event.date.end.slice(0, 16),
          venue: event.venue || "",
          isPaid: event.pricing.isPaid,
          amount: event.pricing.amount || 0,
          currency: event.pricing.currency || "INR",
          earlyBirdEnabled: event.pricing.earlyBird.enabled,
          earlyBirdAmount: event.pricing.earlyBird.amount || 0,
          earlyBirdEnd: event.pricing.earlyBird.endDate
            ? event.pricing.earlyBird.endDate.slice(0, 16)
            : "",
          registrationLimit: event.registrationLimit || 0,
        });
      } catch (err) {
        console.error("Load Event Error:", err);
        setError("Failed to load event");
      } finally {
        setLoadingEvent(false);
      }
    };

    loadEvent();
  }, [id]);

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

      await eventApi.updateEvent(id, payload);

      setSuccess("Event updated successfully!");

      setTimeout(() => navigate(`/events/${id}`), 1200);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update event");
    }
  };

  if (loading || loadingEvent)
    return <p className="loading">Loading Event...</p>;

  return (
    <div className="create-container">
      <h1>Edit Event</h1>

      <form className="create-form" onSubmit={handleSubmit}>

        <label>Event Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        ></textarea>

        <label>Banner Image URL</label>
        <input
          name="bannerUrl"
          value={form.bannerUrl}
          onChange={handleChange}
        />

        <label>Event Type</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="hackathon">Hackathon</option>
          <option value="workshop">Workshop</option>
          <option value="contest">Contest</option>
        </select>

        <label>Visibility</label>
        <select name="visibility" value={form.visibility} onChange={handleChange}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        {form.visibility === "private" && (
          <>
            <label>Allowed Colleges (comma-separated IDs)</label>
            <input
              name="allowedCollegeIds"
              value={form.allowedCollegeIds.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  allowedCollegeIds: e.target.value.split(",").map((v) => v.trim()),
                })
              }
            />
          </>
        )}

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

        <label>Venue</label>
        <input name="venue" value={form.venue} onChange={handleChange} />

        {/* Pricing Section */}
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

                <label>Early Bird End</label>
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

        <label>Registration Limit</label>
        <input
          type="number"
          name="registrationLimit"
          value={form.registrationLimit}
          onChange={handleChange}
        />

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <button className="create-btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
