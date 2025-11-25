import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";

export default function GameSearch() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    async function fetchGames() {
      if (!query) {
        setGames([]);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get(`games/search/`, { params: { query } });
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
    try {
      // backend endpoint supports game_id + status
      await api.post("library/add-from-rawg/", {
        game_id: game.id,
        status,
      });
      alert(`${game.name} added to your library`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add to library");
    }
  }

  return (
    <div>
      <h1>Search Results {query && `for "${query}"`}</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {games.length === 0 && !loading && <p>No results</p>}
      <ul>
        {games.map((g) => (
          <li key={g.id}>
            {g.background_image && (
              <img src={g.background_image} alt={g.name} width="100" />
            )}
            <strong>{g.name}</strong>
            <div>
              <button onClick={() => addToLibrary(g, "wishlist")}>Wishlist</button>
              <button onClick={() => addToLibrary(g, "favorite")}>Favorite</button>
              <button onClick={() => addToLibrary(g, "played")}>Played</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}