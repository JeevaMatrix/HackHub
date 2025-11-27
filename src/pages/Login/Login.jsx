import React, { useState } from "react";
import "./login.css";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await login(form);
      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        window.location.href = "/";
      }, 800);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={submitLogin} className="login-form">

        <label>Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="btn-submit">Login</button>
      </form>

      <p>
        Don't have an account? <a href="/signup">Signup</a>
      </p>
    </div>
  );
};

export default Login;
