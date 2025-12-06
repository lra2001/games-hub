import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { AVATARS } from "../constants/avatars.js";

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

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await api.put("users/me/", form);
      setUser(res.data); // update user in context
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      console.error(err);
      const detail =
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        "Failed to update profile.";
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

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
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