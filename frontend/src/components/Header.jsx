import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (onSearch) onSearch(query);
  }

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">GamesHub</Link>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="auth-links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </header>
  );
}