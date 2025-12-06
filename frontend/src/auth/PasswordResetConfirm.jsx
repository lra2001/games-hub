import { use, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import useFormErrors from "../hooks/useFormErrors.js";

export default function PasswordResetConfirm() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    new_password: "",
    re_new_password: "",
  });
  const [message, setMessage] = useState(null); // { type, text }
  const [loading, setLoading] = useState(false);

  const { errors, setFieldError, getFieldError, clearFieldError, clearAllErrors, } = useFormErrors();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    clearAllErrors();

    let hasError = false;

    if (!form.new_password) {
      setFieldError("new_password", "New password is required.");
      hasError = true;
    } else if (form.new_password.length < 8) {
      setFieldError("new_password", "Password must be at least 8 characters.");
      hasError = true;
    }

    if (!form.re_new_password) {
      setFieldError("re_new_password", "Please confirm your new password.");
      hasError = true;
    } else if (form.new_password !== form.re_new_password) {
      setFieldError("re_new_password", "Passwords do not match.");
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      await api.post("users/password-reset-confirm/", {
        uid,
        token,
        password: form.new_password,
      });
      setMessage({
        type: "success",
        text: "Your password has been reset. You can now login.",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      const backendMsg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "This link is invalid or has expired.";
      setMessage({ type: "error", text: backendMsg });
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

        <form onSubmit={handleSubmit} noValidate>
          <div className="password-field">
            <input
              type="password"
              name="new_password"
              placeholder="New password"
              value={form.new_password}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  new_password: e.target.value,
                }));
                clearFieldError("new_password");
              }}
            />
          </div>
          {getFieldError("new_password") && (
            <p className="field-error">{getFieldError("new_password")}</p>
          )}

          <div className="password-field">
            <input
              type="password"
              name="re_new_password"
              placeholder="Confirm new password"
              value={form.re_new_password}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  re_new_password: e.target.value,
                }));
                clearFieldError("re_new_password");
              }}
            />
          </div>
          {getFieldError("re_new_password") && (
            <p className="field-error">
              {getFieldError("re_new_password")}
            </p>
          )}

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