import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function GameDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const prevQuery = searchParams.get("query");
  const prevPage = searchParams.get("page");
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addingStatus, setAddingStatus] = useState(null);
  const [libraryStatuses, setLibraryStatuses] = useState({
    wishlist: false,
    favorite: false,
    played: false,
  });

  const [message, setMessage] = useState(null); // { type, text }

  // Load game details from backend
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
  if (error) return <p className="alert error">{error}</p>;
  if (!game) return null;

  const { wishlist, favorite, played } = libraryStatuses;

  return (
    <div className="game-detail-page">
      <div className="game-detail-card">
        <div className="game-detail-topbar">
          <Link
            to={
              prevQuery
                ? `/search?query=${encodeURIComponent(prevQuery)}${
                    prevPage ? `&page=${prevPage}` : ""
                  }`
                : "/search"
            }
          >
            &larr; Back to search
          </Link>
        </div>

        {message && (
          <p className={`alert ${message.type}`}>
            {message.text}
          </p>
        )}

        <div className="game-detail-header">
            <img
              src={game.background_image || "/images/no-image.png"}
              alt={game.name}
              className="game-detail-image"
            />

          <div className="game-detail-main">
            <h1 className="game-detail-title">{game.name}</h1>

            <div className="game-detail-meta">
              <p>
                ⭐{" "}
                {game.rating ?? "N/A"}
              </p>
              <p>
                <strong>Released:</strong>{" "}
                {game.released ?? "Unknown"}
              </p>
            </div>

            <div className="game-detail-actions">
              {user ? (
                <>
                  <button
                    onClick={() => addToLibrary("wishlist")}
                    disabled={!!addingStatus || wishlist}
                  >
                    {wishlist
                      ? "In Wishlist"
                      : addingStatus === "wishlist"
                      ? "Adding…"
                      : "Add to Wishlist"}
                  </button>

                  <button
                    onClick={() => addToLibrary("favorite")}
                    disabled={!!addingStatus || favorite}
                  >
                    {favorite
                      ? "In Favorites"
                      : addingStatus === "favorite"
                      ? "Adding…"
                      : "Add to Favorites"}
                  </button>

                  <button
                    onClick={() => addToLibrary("played")}
                    disabled={!!addingStatus || played}
                  >
                    {played
                      ? "In Played"
                      : addingStatus === "played"
                      ? "Adding…"
                      : "In Played"}
                  </button>
                </>
              ) : (
                <p className="game-detail-login-hint">
                  <Link to="/login">Login</Link> or{" "}
                  <Link to="/register">Register</Link> to add this game
                  to your Wishlist, Favorites or Played list.
                </p>
              )}
            </div>
          </div>
        </div>

        {game.description_raw && (
          <div className="game-detail-description">
            <h3>Description</h3>
            <p>{game.description_raw}</p>
          </div>
        )}
      </div>
    </div>
  );
}