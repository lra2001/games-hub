import { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useFormErrors from "../hooks/useFormErrors.js";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [globalError, setGlobalError] = useState("");

  const { errors, clearAllErrors, validate } = useFormErrors();

  const from = location.state?.from;

  async function handleSubmit(e) {
    e.preventDefault();
    setGlobalError("");
    clearAllErrors();

    const isValid = validate(
      {
        username: form.username,
        password: form.password,
      },
      {
        username: (value) =>
          !value.trim() ? "Username is required." : "",
        password: (value) =>
          !value ? "Password is required." : "",
      }
    );

    if (!isValid) return;

    try {
      const res = await api.post("users/token/", form);
      login(res.data.access, res.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      const backendMsg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0];

      setGlobalError(
        backendMsg || "Invalid username or password."
      );
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        {from && (
          <p className="alert info">
            Please login or register to access your dashboard.
          </p>
        )}

        {globalError && (
          <p className="alert error">{globalError}</p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className={errors.username ? "input-error" : ""}
            />
            {errors.username && (
              <div className="field-error">
                {errors.username}
              </div>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <div className="field-error">
                {errors.password}
              </div>
            )}
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="auth-footer">
          <p>
            Forgot Password? <Link to="/password-reset-request">Reset Password</Link>
          </p>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}