import { useState } from "react";
import { useAuth } from "./useAuth";

export default function Register() {
  const { register, error } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await register(
      form.username,
      form.email,
      form.password,
      form.password2,
      form.first_name,
      form.last_name
    );
    if (ok) window.location.href = "/login";
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="password2" type="password" placeholder="Confirm Password" onChange={handleChange} required />
        <input name="first_name" placeholder="First Name (optional)" onChange={handleChange} />
        <input name="last_name" placeholder="Last Name (optional)" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      {error && <p className="alert error">{error}</p>}
      </div>
    </div>
  );
}