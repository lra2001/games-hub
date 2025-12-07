import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { AVATAR_MAP } from "../constants/avatars";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
    setMenuOpen(false);
  }

  function handleSearch(e) {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setMenuOpen(false);
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
      <div className="header-top">
        {/* Logo */}
        <div className="logo">
          <Link to="/">GamesHub</Link>
        </div>

        {/* Search – center on desktop, full row on mobile */}
        <form
          onSubmit={handleSearch}
          noValidate
          className="search-form header-search"
        >
          <input
            name="search"
            type="text"
            placeholder="Search 897,466 games..."
          />
          <button type="submit">Search</button>
        </form>

        {/* Right side: avatar + menu */}
        <div className="header-right">
          {user && (
            <button
              type="button"
              className="header-avatar-button"
              onClick={() => {
                navigate("/dashboard/profile");
                setMenuOpen(false);
              }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="header-avatar" />
              ) : (
                <span className="header-username">{displayName}</span>
              )}
            </button>
          )}

          {/* Hamburger (always present, but hidden via CSS on desktop) */}
          <button
            type="button"
            className="header-menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>

          {/* Auth links */}
          <nav className={`auth-links ${menuOpen ? "open" : ""}`}>
            {user ? (
              <>
                <Link to="/dashboard/wishlist" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>

                {/* Profile */}
                <Link
                  to="/dashboard/profile"
                  onClick={() => setMenuOpen(false)}
                  className="auth-profile-link"
                >
                  Profile
                </Link>

                <button
                  type="button"
                  className="header-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}