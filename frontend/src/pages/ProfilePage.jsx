import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { AVATARS } from "../constants/avatars.js";
import useFormErrors from "../hooks/useFormErrors.js";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    avatar: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }

  const {
    errors,
    setFieldError,
    getFieldError,
    clearFieldError,
    clearAllErrors,
  } = useFormErrors();

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        avatar: user.avatar || "",
      });
      clearAllErrors();
    }
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
    setMessage(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    clearAllErrors();

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
      hasError = true;
    }

    if (hasError) {
      setSaving(false);
      return;
    }

    try {
    const res = await api.put("users/me/", form);
    setUser(res.data);
    setMessage({
      type: "success",
      text: "Profile updated successfully.",
      });
    } catch (err) {
      console.error(err);
      const data = err.response?.data;

      if (data?.email?.[0]) {
        setFieldError("email", data.email[0]);
      }
      if (data?.username?.[0]) {
        setFieldError("username", data.username[0]);
      }

      const detail =
        data?.detail || data?.non_field_errors?.[0] || "Failed to update profile.";
      setMessage({ type: "error", text: detail });
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return <p>Loading profile…</p>;
  }

  return (
    <div>
      <h2>Profile</h2>

      {message && (
        <p className={`alert ${message.type}`}>{message.text}</p>
      )}

      <form className="profile-form" onSubmit={handleSubmit} noValidate>
        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
          />
          {getFieldError("username") && (
            <p className="field-error">{getFieldError("username")}</p>
          )}
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          {getFieldError("email") && (
            <p className="field-error">{getFieldError("email")}</p>
          )}
        </label>

        <label>
          First name
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
          />
        </label>

        <label>
          Last name
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
          />
        </label>

        <div className="profile-avatar-section">
          <p>Select your Avatar:</p>
          <div className="avatar-grid">
            {AVATARS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={
                  "avatar-choice" +
                  (form.avatar === opt.id ? " selected" : "")
                }
                onClick={() =>
                  setForm((prev) => ({ ...prev, avatar: opt.id }))
                }
              >
                <img src={opt.src} alt={opt.label} />
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}