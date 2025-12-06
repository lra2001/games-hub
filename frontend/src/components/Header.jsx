import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { AVATAR_MAP } from "../constants/avatars";

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

  const displayName =
    user?.first_name?.trim() ||
    user?.username ||
    "Profile";

  const avatarUrl = user?.avatar
    ? AVATAR_MAP[user.avatar]?.src || null
    : null;

  return (
    <header className="header">
      {/* Logo – goes to /dashboard if logged in, otherwise home */}
      <div className="logo">
        <Link to="/">GamesHub</Link>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="search-form">
        <input name="search" type="text" placeholder="Search 897,466 games..." />
        <button type="submit">Search</button>
      </form>

      {/* Right side - auth controls */}
      <div className="auth-links">
        {user ? (
          <>
            {/* Dashboard shortcut */}
            <Link to="/dashboard">Dashboard</Link>

            {/* Profile Link (avatar OR name) */}
            <div>
              <Link to="/dashboard/profile">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="header-avatar"/>
              ) : (
                <span>{displayName}</span>
              )}
              </Link>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
            >
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