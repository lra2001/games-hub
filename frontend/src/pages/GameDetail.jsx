import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function GameDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addingStatus, setAddingStatus] = useState(null);

  useEffect(() => {
    async function loadGame() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`games/${id}/`);
        setGame(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load game details.");
      } finally {
        setLoading(false);
      }
    }
    loadGame();
  }, [id]);

  async function addToLibrary(status = "wishlist") {
    if (!user) {
      alert("Please login or register to add games to your library.");
      return;
    }

    try {
      setAddingStatus(status);
      await api.post("library/add-from-rawg/", {
        game_id: game.id,
        status,
      });
      alert(`Added to your ${status} list.`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add to library.");
    } finally {
      setAddingStatus(null);
    }
  }

  if (loading) return <p>Loading game…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!game) return null;

  return (
    <div className="game-detail">
      <h1>{game.name}</h1>

      {game.background_image && (
        <img
          src={game.background_image}
          alt={game.name}
          className="game-detail-image"
        />
      )}

      <p><strong>Rating:</strong> {game.rating ?? "N/A"}</p>
      <p><strong>Released:</strong> {game.released ?? "Unknown"}</p>

      {game.description_raw && (
        <>
          <h3>Description</h3>
          <p>{game.description_raw}</p>
        </>
      )}

      <div className="game-detail-actions">
        {user ? (
          <>
            <button
              onClick={() => addToLibrary("wishlist")}
              disabled={!!addingStatus}
            >
              {addingStatus === "wishlist" ? "Adding…" : "Add to Wishlist"}
            </button>
            <button
              onClick={() => addToLibrary("favorite")}
              disabled={!!addingStatus}
            >
              {addingStatus === "favorite" ? "Adding…" : "Add to Favorites"}
            </button>
            <button
              onClick={() => addToLibrary("played")}
              disabled={!!addingStatus}
            >
              {addingStatus === "played" ? "Adding…" : "Mark as Played"}
            </button>
          </>
        ) : (
          <p style={{ color: "gray" }}>
            <a href="/login">Login</a> or{" "}
            <a href="/register">Register</a> to add this game
            to your Wishlist, Favorites or Played list.
          </p>
        )}
      </div>
    </div>
  );
}