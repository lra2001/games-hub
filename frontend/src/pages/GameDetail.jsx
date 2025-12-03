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
  const [libraryStatuses, setLibraryStatuses] = useState({
    wishlist: false,
    favorite: false,
    played: false,
  });
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  // Load game details from backend (proxying RAWG)
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

  // After game and user are known, check if this game is in user's library
  useEffect(() => {
    if (!user || !game) return;

    async function loadLibraryStatus() {
      try {
        const res = await api.get("library/");
        const thisGameItems = res.data.filter(
          (item) => item.game_id === game.id
        );
        const statuses = { wishlist: false, favorite: false, played: false };
        thisGameItems.forEach((item) => {
          const key = item.status?.toLowerCase();
          if (key && statuses.hasOwnProperty(key)) {
            statuses[key] = true;
          }
        });
        setLibraryStatuses(statuses);
      } catch (err) {
        console.error("Failed to load library for this game:", err);
      }
    }

    loadLibraryStatus();
  }, [user, game]);

  async function addToLibrary(status = "wishlist") {
    if (!user) {
      setMessage({
        type: "error",
        text: "Please login or register to add games to your library.",
      });
      return;
    }

    try {
      setAddingStatus(status);
      setMessage(null);
      await api.post("library/add-from-rawg/", {
        game_id: game.id,
        status,
      });

      // Mark this status as present so the button can be disabled
      setLibraryStatuses((prev) => ({
        ...prev,
        [status]: true,
      }));

      setMessage({
        type: "success",
        text: `Added to your ${status} list.`,
      });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Failed to add to library.",
      });
    } finally {
      setAddingStatus(null);
    }
  }

  if (loading) return <p>Loading game…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!game) return null;

  const { wishlist, favorite, played } = libraryStatuses;

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

      <p>
        <strong>Rating:</strong> {game.rating ?? "N/A"}
      </p>
      <p>
        <strong>Released:</strong> {game.released ?? "Unknown"}
      </p>

      {game.description_raw && (
        <>
          <h3>Description</h3>
          <p>{game.description_raw}</p>
        </>
      )}

      {/* Inline feedback */}
      {message && (
        <p className={message.type === "error" ? "error" : "success"}>
          {message.text}
        </p>
      )}

      <div className="game-detail-actions">
        {user ? (
          <>
            <button
              onClick={() => addToLibrary("wishlist")}
              disabled={!!addingStatus || wishlist}
            >
              {wishlist
                ? "This game is already in your Wishlist"
                : addingStatus === "wishlist"
                ? "Adding…"
                : "Add to Wishlist"}
            </button>

            <button
              onClick={() => addToLibrary("favorite")}
              disabled={!!addingStatus || favorite}
            >
              {favorite
                ? "This game is already in your Favorites"
                : addingStatus === "favorite"
                ? "Adding…"
                : "Add to Favorites"}
            </button>

            <button
              onClick={() => addToLibrary("played")}
              disabled={!!addingStatus || played}
            >
              {played
                ? "This game is already marked as Played"
                : addingStatus === "played"
                ? "Adding…"
                : "Mark as Played"}
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