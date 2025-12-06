import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import useFormErrors from "../hooks/useFormErrors.js";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const {
    errors,
    setFieldError,
    getFieldError,
    clearFieldError,
    clearAllErrors,
  } = useFormErrors();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
    setGlobalError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    clearAllErrors();
    setGlobalError("");
    setSubmitting(true);

    let hasError = false;

    if (!form.username.trim()) {
      setFieldError("username", "Username is required.");
      hasError = true;
    }

    if (!form.email.trim()) {
      setFieldError("email", "Email is required.");
      hasError = true;
    } else if (!form.email.includes("@")) {
      setFieldError("email", "Enter a valid email.");
      hasError = true; }

    if (!form.password) {
      setFieldError("password", "Password is required.");
      hasError = true;
    } else if (form.password.length < 8) {
      setFieldError("password", "Password must be at least 8 characters.");
      hasError = true;
    }

    if (!form.password2) {
      setFieldError("password2", "Please confirm your password.");
      hasError = true;
    } else if (form.password !== form.password2) {
      setFieldError("password2", "Passwords do not match.");
      hasError = true;
    }

    if (hasError) {
      setSubmitting(false);
      return;
    }

    try {
      await api.post("users/register/", form);
      // success → go to login
      navigate("/login", { state: { justRegistered: true } });
    } catch (err) {
      console.error(err);
      const data = err.response?.data;

      if (data) {
        if (data.username?.[0]) {
          setFieldError("username", data.username[0]);
        }
        if (data.email?.[0]) {
          setFieldError("email", data.email[0]);
        }
        if (data.password?.[0]) {
          setFieldError("password", data.password[0]);
        }
        if (data.non_field_errors?.[0]) {
          setGlobalError(data.non_field_errors[0]);
        } else if (data.detail) {
          setGlobalError(data.detail);
        }
      } else {
        setGlobalError("Registration failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
      <h2>Register</h2>


        {globalError && (
          <p className="alert error">{globalError}</p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          {getFieldError("username") && (
            <p className="field-error">{getFieldError("username")}</p>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {getFieldError("email") && (
            <p className="field-error">{getFieldError("email")}</p>
          )}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {getFieldError("password") && (
            <p className="field-error">{getFieldError("password")}</p>
          )}

          <input
            name="password2"
            type="password"
            placeholder="Confirm password"
            value={form.password2}
            onChange={handleChange}
          />
          {getFieldError("password2") && (
            <p className="field-error">{getFieldError("password2")}</p>
          )}

          <input
            name="first_name"
            placeholder="First Name (optional)"
            value={form.first_name}
            onChange={handleChange}
          />

          <input
            name="last_name"
            placeholder="Last Name (optional)"
            value={form.last_name}
            onChange={handleChange}
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Registering…" : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}