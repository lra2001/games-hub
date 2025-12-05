import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function LibraryPage({ status }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const res = await api.get("library/");
        const filtered = res.data.filter((item) => item.status === status);

        // Fetch RAWG details for platforms + genres
        const enriched = await Promise.all(
          filtered.map(async (item) => {
            try {
              const detailRes = await api.get(`games/${item.game_id}/`);
              return {
                ...item,
                platforms: detailRes.data.platforms || [],
                genres: detailRes.data.genres || [],
              };
            } catch {
              return {
                ...item,
                platforms: [],
                genres: [],
              };
            }
          })
        );

        setItems(enriched);
      } catch (err) {
        console.error("Failed to load library:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [status]);

  async function removeItem(id) {
    if (!window.confirm("Remove this game from your library?")) return;

    try {
      await api.delete(`library/${id}/`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert("Could not remove item.");
    }
  }

  const label =
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div>
      <h2>{label}</h2>
      {loading && <p>Loading…</p>}
      {!loading && items.length === 0 && <p>No games added yet.</p>}

      {!loading && items.length > 0 && (
        <div className="search-results-card">
          <div className="game-grid">
            {items.map((item) => (
              <div key={item.id} className="game-card">
                <Link to={`/games/${item.game_id}`} className="game-card-link">
                  <img
                    src={item.background_image || "/images/no-image.png"}
                    alt={item.title}
                  />
                  <div className="game-card-body">
                    <h3>{item.title}</h3>

                    <div className="game-meta">
                      <p>
                        <strong>Platforms: </strong>{item.platforms.length > 0 ? item.platforms .map((p) => p.platform?.name || p.name) .join(", ") : "Unknown Platform"}
                      </p>
                      <p>
                        <strong>Genre: </strong>{item.genres.length > 0 ? item.genres.map((g) => g.name).join(", ") : "Unknown Genre"}
                      </p>
                      <p>
                        {"⭐ "} {item.rating ?? "N/A"}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="game-actions">
                  <button
                    className="danger"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}