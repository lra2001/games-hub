import { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import api from "../api/axios.js";
import LibraryPage from "./LibraryPage.jsx";
import ProfilePage from "./ProfilePage.jsx";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const counts = items.reduce(
  (acc, item) => {
    const key = item.status?.toLowerCase();
    if (key === "wishlist") acc.wishlist += 1;
    if (key === "favorite") acc.favorite += 1;
    if (key === "played") acc.played += 1;
    return acc;
  },
  { wishlist: 0, favorite: 0, played: 0 }
);

  useEffect(() => {
    async function loadLibrary() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("library/");
        setItems(res.data);
      } catch (err) {
        console.error("Failed to load library:", err);
        setError("Failed to load your library.");
      } finally {
        setLoading(false);
      }
    }

    loadLibrary();
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <nav>
          <NavLink to="/dashboard/wishlist">
            Wishlist ({counts.wishlist})
          </NavLink>
          <NavLink to="/dashboard/favorites">
            Favorites ({counts.favorite})
          </NavLink>
          <NavLink to="/dashboard/played">
            Played ({counts.played})
          </NavLink>
          <NavLink to="/dashboard/profile">
            Profile
          </NavLink>
        </nav>
      </aside>

      <main className="dashboard-main">
        {loading && <p>Loading library…</p>}
        {error && <p className="alert error">{error}</p>}

        {!loading && !error && (
          <Routes>
            <Route
              path="wishlist"
              element={
                <LibraryPage
                  status="wishlist"
                />
              }
            />
            <Route
              path="favorites"
              element={
                <LibraryPage
                  status="favorite"
                />
              }
            />
            <Route
              path="played"
              element={
                <LibraryPage
                  status="played"
                />
              }
            />
            <Route
              path="profile"
              element={<ProfilePage />}
            />
            <Route
              index
              element={<p>Select a list from the sidebar.</p>}
            />
          </Routes>
        )}
      </main>
    </div>
  );
}