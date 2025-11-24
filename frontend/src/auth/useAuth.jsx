import { useState } from "react";
import api from "../api/axios.js";

export function useAuth() {
  const [error, setError] = useState(null);

  async function login(username, password) {
    try {
      const response = await api.post("users/token/", { username, password });
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      setError(null);
      return true;
    } catch (err) {
      setError("Invalid username or password");
      return false;
    }
  }

  async function register(username, email, password, password2, first_name = "", last_name = "") {
  try {
    await api.post("users/register/", {
      username,
      email,
      password,
      password2,
      first_name,
      last_name,
    });
    setError(null);
    return true;
  } catch (err) {
    console.log(err.response?.data);
    setError("Registration failed");
    return false;
  }
}

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }

  return { login, register, logout, error };
}