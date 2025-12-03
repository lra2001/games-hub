// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import api from "../api/axios.js";
import LibraryPage from "./LibraryPage.jsx";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  async function handleRemove(id) {
    if (!window.confirm("Remove this game from your library?")) return;

    try {
      await api.delete(`library/${id}/`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert("Could not remove item.");
    }
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <nav>
          <NavLink to="/dashboard/wishlist">Wishlist</NavLink>
          <NavLink to="/dashboard/favorites">Favorites</NavLink>
          <NavLink to="/dashboard/played">Played</NavLink>
        </nav>
      </aside>

      <main className="dashboard-main">
        {loading && <p>Loading library…</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <Routes>
            <Route
              path="wishlist"
              element={
                <LibraryPage
                  items={items}
                  status="wishlist"
                  onRemove={handleRemove}
                />
              }
            />
            <Route
              path="favorites"
              element={
                <LibraryPage
                  items={items}
                  status="favorite"
                  onRemove={handleRemove}
                />
              }
            />
            <Route
              path="played"
              element={
                <LibraryPage
                  items={items}
                  status="played"
                  onRemove={handleRemove}
                />
              }
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