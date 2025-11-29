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
    brochureUrl: "",
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

  // NEW: Local states for file uploads
  const [newBannerFile, setNewBannerFile] = useState(null);
  const [newBrochureFile, setNewBrochureFile] = useState(null);

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
          brochureUrl: event.brochureUrl || "",
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

  // -------------------------------
  // 🔥 UPDATE EVENT FUNCTION (FORMDATA)
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      // Add text fields
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("type", form.type);
      formData.append("visibility", form.visibility);

      if (form.visibility === "private") {
        form.allowedCollegeIds.forEach((id) =>
          formData.append("allowedCollegeIds[]", id)
        );
      }

      formData.append("date[start]", form.startDate);
      formData.append("date[end]", form.endDate);
      formData.append("venue", form.venue);

      formData.append("pricing[isPaid]", form.isPaid);
      formData.append("pricing[amount]", form.amount);
      formData.append("pricing[currency]", form.currency);

      formData.append("pricing[earlyBird][enabled]", form.earlyBirdEnabled);
      formData.append("pricing[earlyBird][amount]", form.earlyBirdAmount);
      formData.append("pricing[earlyBird][endDate]", form.earlyBirdEnd);

      formData.append("registrationLimit", form.registrationLimit);

      // Add NEW uploaded files ONLY if changed
      if (newBannerFile) formData.append("banner", newBannerFile);
      if (newBrochureFile) formData.append("brochure", newBrochureFile);

      // Send to backend
      await eventApi.updateEventFormData(id, formData);

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

        {/* Existing Banner Preview */}
        {form.bannerUrl && (
          <>
            <label>Existing Banner</label>
            <img src={form.bannerUrl} alt="banner" className="preview-img" />
          </>
        )}

        {/* New Banner Upload */}
        <label>Upload New Banner Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewBannerFile(e.target.files[0])}
        />

        {/* Existing Brochure */}
        {form.brochureUrl && (
          <>
            <label>Current Brochure</label>
            <a 
              href={form.brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Current Brochure
            </a>
          </>
        )}

        {/* New Brochure Upload */}
        <label>Upload New Brochure (PDF)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setNewBrochureFile(e.target.files[0])}
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
        <input name="venue" value={form.venue} onChange={handleChange} />

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

        {/* Registration Limit */}
        <label>Registration Limit</label>
        <input
          type="number"
          name="registrationLimit"
          value={form.registrationLimit}
          onChange={handleChange}
        />

        {/* Messages */}
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
