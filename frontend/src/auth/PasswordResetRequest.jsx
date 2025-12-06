import { useState } from "react";
import api from "../api/axios.js";
import useFormErrors from "../hooks/useFormErrors.js";

export default function PasswordResetRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null); // { type, text }
  const [loading, setLoading] = useState(false);
  const { errors, validate, clearAllErrors } = useFormErrors();

  async function handleSubmit(e) {
    e.preventDefault();
    clearAllErrors();

    const isValid = validate(
    {
      email,
    },
    {
      email: (value) =>
        !value.trim()
          ? "Email is required."
          : !value.includes("@")
          ? "Enter a valid email."
          : "",
    }
  );

  if (!isValid) return;

    try {
      await api.post("users/password-reset/", { email });
      setMessage({
        type: "success",
        text: "An email was sent to reset your password if an account with this email exists. Please check your inbox, including the spam/junk folder.",
      });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Something went wrong while sending the password reset email.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot your password?</h2>

        <p className="info">
          Enter the email associated with your account and we'll send you a link
          to reset your password.
        </p>

        {message && (
          <p className={`alert ${message.type}`}>
            {message.text}
          </p>
        )}

        {errors.email && (
          <p className="alert error">{errors.email}</p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className={errors.email ? "input-error" : ""}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remembered it? <a href="/login">Back to login</a>
          </p>
        </div>
      </div>
    </div>
  );
}