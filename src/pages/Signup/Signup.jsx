import React, { useState } from "react";
import "./signup.css";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "student",
    collegeId: "",
    department: "",
    year: "",
    upiId: "" // Only for organizers
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { signup } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await signup(form);
      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => (window.location.href = "/login"), 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>

      <form onSubmit={submitSignup} className="signup-form">

        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>Phone Number</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="10-digit number"
          required
        />

        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="organizer">Organizer</option>
        </select>

        {/* Only show UPI field if organizer */}
        {form.role === "organizer" && (
          <>
            <label>Organizer UPI ID</label>
            <input
              name="upiId"
              value={form.upiId}
              onChange={handleChange}
              placeholder="example@upi"
              required
            />
          </>
        )}

        <label>College ID</label>
        <input name="collegeId" value={form.collegeId} onChange={handleChange} />

        <label>Department</label>
        <input name="department" value={form.department} onChange={handleChange} />

        <label>Year</label>
        <input name="year" value={form.year} onChange={handleChange} />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="btn-submit">Signup</button>
      </form>

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
