import { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const from = location.state?.from;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("users/token/", form);
      login(res.data.access, res.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="auth-container">
      <h1>Login</h1>

      {from && (
        <p className="info">
          Please login or register to access your dashboard.
        </p>
      )}

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p>
        Don’t have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}