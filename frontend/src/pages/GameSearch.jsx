import { useState, useEffect } from "react";
import api from "../api/axios.js";

export default function GameSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      if (!query) return;
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      fetch(`${backendUrl}/api/games/search/?query=${query}`)
      const data = await res.json();
      setResults(data.results || []);
    }

    fetchGames();
  }, [query]);

  return (
    <div>
      <h1>Search Games</h1>
      <input
        type="text"
        placeholder="Search games..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ul>
        {results.map((game) => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
    </div>
  );
}