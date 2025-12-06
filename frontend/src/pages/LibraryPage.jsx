import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function LibraryPage({ status }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [feedback, setFeedback] = useState(null); // { type, text }
  const [pendingDelete, setPendingDelete] = useState(null); // { id, title }

  const label = status.charAt(0).toUpperCase() + status.slice(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setFeedback(null);
      try {
        const res = await api.get("library/");
        const filtered = res.data.filter((item) => item.status === status);
        setItems(filtered);
      } catch (err) {
        console.error("Failed to load library:", err);
        setFeedback({
          type: "error",
          text: "Failed to load your library. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [status]);

  function askRemove(item) {
    setPendingDelete({
      id: item.id,
      title: item.title || `Game #${item.game_id}`,
    });
    setFeedback(null);
  }

  function cancelRemove() {
    setPendingDelete(null);
  }

  async function confirmRemove() {
    if (!pendingDelete) return;

    try {
      await api.delete(`library/${pendingDelete.id}/`);
      setItems((prev) =>
        prev.filter((item) => item.id !== pendingDelete.id)
      );
      setFeedback({
        type: "success",
        text: `"${pendingDelete.title}" has been removed from your ${label} list.`,
      });
    } catch (err) {
      console.error("Failed to remove item:", err);
      setFeedback({
        type: "error",
        text: "Could not remove this game. Please try again.",
      });
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div>
      <h2>{label}</h2>

      {/* Top feedback message */}
      {feedback && (
        <p className={`alert ${feedback.type}`}>
          {feedback.text}
        </p>
      )}

      {loading && <p>Loading…</p>}
      {!loading && items.length === 0 && <p>No games added yet.</p>}

      {!loading && items.length > 0 && (
        <div className="search-results-card">
          <div className="game-grid">
            {items.map((item) => (
              <div key={item.id} className="game-card">
                <Link
                  to={`/games/${item.game_id}`}
                  className="game-card-link"
                >
                  <img
                    src={item.background_image || "/images/no-image.png"}
                    alt={item.title || `Game #${item.game_id}`}
                  />
                  <div className="game-card-body">
                    <h3>{item.title || `Game #${item.game_id}`}</h3>

                    <div className="game-meta">
                      <p>
                        <strong>Platforms: </strong>
                        {item.platforms && item.platforms.length > 0
                          ? item.platforms
                              .map(
                                (p) => p.platform?.name || p.name
                              )
                              .join(", ")
                          : "Unknown Platform"}
                      </p>
                      <p>
                        <strong>Genre: </strong>
                        {item.genres && item.genres.length > 0
                          ? item.genres.map((g) => g.name).join(", ")
                          : "Unknown Genre"}
                      </p>
                      <p>⭐ {item.rating ?? "N/A"}</p>
                    </div>
                  </div>
                </Link>

                <div className="game-actions">
                  {pendingDelete?.id === item.id ? (
                    <div className="inline-confirm">
                      <span>
                        Remove this game from your {label} list?
                      </span>
                      <button
                        type="button"
                        className="confirm-btn"
                        onClick={confirmRemove}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={cancelRemove}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="danger"
                      type="button"
                      onClick={() => askRemove(item)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}