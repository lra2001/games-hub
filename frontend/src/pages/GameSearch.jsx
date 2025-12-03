import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function GameSearch() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type, text }

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    async function fetchGames() {
      if (!query) {
        setGames([]);
        return;
      }
      setLoading(true);
      setError(null);
      setFeedback(null);
      try {
        const res = await api.get("games/search/", { params: { query } });
        setGames(res.data.results || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch games");
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, [query]);

  async function addToLibrary(game, status = "wishlist") {
    if (!user) {
      setFeedback({
        type: "error",
        text: "Please login or register to add games to your library.",
      });
      console.log("feedback set:", {
        type: "error",
        text: "Please login or register to add games to your library.",
      });
      return;
    }

    try {
      await api.post("library/add-from-rawg/", {
        game_id: game.id,
        status,
      });
      const msg = {
        type: "success",
        text: `${game.name} added to your ${status} list.`,
      };
      setFeedback(msg);
      console.log("feedback set:", msg);
    } catch (err) {
      console.error(err);
      const msg = {
        type: "error",
        text:
          err.response?.data?.error ||
          "Failed to add game to your library.",
      };
      setFeedback(msg);
      console.log("feedback set:", msg);
    }
  }

  return (
    <div>
      <h1>Search Results {query && `for "${query}"`}</h1>

      {/* INLINE FEEDBACK */}
      {feedback && (
        <p className={`alert ${feedback.type}`}>
          {feedback.text}
        </p>
      )}

      {loading && <p>Loading…</p>}
      {error && <p className="alert error">{error}</p>}
      {games.length === 0 && !loading && <p>No results</p>}

      <ul>
        {games.map((g) => (
          <li key={g.id}>
            {g.background_image && (
              <img src={g.background_image} alt={g.name} width="100" />
            )}

            <strong>
              <Link to={`/games/${g.id}`}>{g.name}</Link>
            </strong>

            {user ? (
              <div>
                <button onClick={() => addToLibrary(g, "wishlist")}>
                  Wishlist
                </button>
                <button onClick={() => addToLibrary(g, "favorite")}>
                  Favorite
                </button>
                <button onClick={() => addToLibrary(g, "played")}>
                  Played
                </button>
              </div>
            ) : (
              <p style={{ color: "gray" }}>
                <a href="/login">Login</a> or{" "}
                <a href="/register">Register</a> to add games to your
                Wishlist, Favorites or Played.
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}