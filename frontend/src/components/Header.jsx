import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleSearch(e) {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  }

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
        <Link to="/">GamesHub</Link>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="search-form">
        <input name="search" type="text" placeholder="Search games..." />
        <button type="submit">Search</button>
      </form>

      {/* Right side: login/register OR user + logout */}
      <div className="auth-links">
        {user ? (
          <>
            <span>Hello, {user.first_name || user.username}</span>
            <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{ marginLeft: "1rem" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}