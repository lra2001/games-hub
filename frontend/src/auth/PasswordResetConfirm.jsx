import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function PasswordResetConfirm() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    new_password: "",
    re_new_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (form.new_password !== form.re_new_password) {
      setMessage({
        type: "error",
        text: "Passwords do not match.",
      });
      setLoading(false);
      return;
    }

    try {
      await api.post("users/password-reset-confirm/", {
        uid,
        token,
        new_password: form.new_password,
      });
      setMessage({
        type: "success",
        text: "Your password has been reset. You can now login.",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.detail ||
          "This link is invalid or has expired.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Set a new password</h2>

        {message && (
          <p className={`alert ${message.type}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="new_password"
              placeholder="New password"
              value={form.new_password}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  new_password: e.target.value,
                }))
              }
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="re_new_password"
              placeholder="Confirm new password"
              value={form.re_new_password}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  re_new_password: e.target.value,
                }))
              }
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Reset password"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Back to <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}