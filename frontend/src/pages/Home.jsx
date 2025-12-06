import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../auth/AuthContext.jsx";

const PAGE_SIZE = 10;

export default function Home() {
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const ratingParam = searchParams.get("rating") || "all";
  const platformParam = searchParams.get("platform") || "all";
  const genreParam = searchParams.get("genre") || "all";

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [page, setPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);

  const [ratingFilter, setRatingFilter] = useState(ratingParam);
  const [platformFilter, setPlatformFilter] = useState(platformParam);
  const [genreFilter, setGenreFilter] = useState(genreParam);

  // track which games are in user's library and their statuses
  const [gameStatuses, setGameStatuses] = useState({});

  // keep page in sync with URL change
  useEffect(() => {
    setPage(pageParam);
  }, [pageParam]);

  // keep filters in sync with URL change
  function syncSearchParams(overrides = {}) {
    const params = {};

    const pg = overrides.page ?? page;
    if (pg && pg !== 1) params.page = String(pg);

    const rf = overrides.rating ?? ratingFilter;
    if (rf && rf !== "all") params.rating = rf;

    const pf = overrides.platform ?? platformFilter;
    if (pf && pf !== "all") params.platform = pf;

    const gf = overrides.genre ?? genreFilter;
    if (gf && gf !== "all") params.genre = gf;

    setSearchParams(params);
  }

  // Fetch games for Home (no search query)
  useEffect(() => {
    async function fetchGames() {
      setLoading(true);
      setError(null);
      setFeedback(null);
      try {
        const res = await api.get("games/search/", {
          params: { page },
        });
        setGames(res.data.results || []);
        const count = res.data.count || 0;
        setTotalPages(count ? Math.max(1, Math.ceil(count / PAGE_SIZE)) : 1);
      } catch (err) {
        console.error(err);
        setError("Failed to load games");
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, [page]);

  function updatePage(newPage) {
    const safePage = Math.min(Math.max(newPage, 1), totalPages || 1);
    setPage(safePage);
    syncSearchParams({ page: safePage });
  }

  // Load user's library to track game statuses
  useEffect(() => {
    async function loadLibraryStatuses() {
      if (!user) {
        setGameStatuses({});
        return;
      }

      try {
        const res = await api.get("library/");
        const statusMap = {};
        res.data.forEach((item) => {
          if (!statusMap[item.game_id]) {
            statusMap[item.game_id] = {
              wishlist: false,
              favorite: false,
              played: false,
            };
          }
          const key = item.status?.toLowerCase();
          if (key && statusMap[item.game_id].hasOwnProperty(key)) {
            statusMap[item.game_id][key] = true;
          }
        });
        setGameStatuses(statusMap);
      } catch (err) {
        console.error("Failed to load library for Home:", err);
      }
    }

    loadLibraryStatuses();
  }, [user]);

  // Build filter options for platforms and genres
  const platformOptions = (() => {
    const map = new Map();
    games.forEach((g) => {
      (g.platforms || []).forEach((p) => {
        const platform = p.platform || p;
        if (platform && !map.has(platform.id)) {
          map.set(platform.id, platform.name);
        }
      });
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  })();

  const genreOptions = (() => {
    const map = new Map();
    games.forEach((g) => {
      (g.genres || []).forEach((genre) => {
        if (genre && !map.has(genre.id)) {
          map.set(genre.id, genre.name);
        }
      });
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  })();

  function passesRatingFilter(game) {
    const r = game.rating ?? 0;

    switch (ratingFilter) {
      case "all":
        return true;
      case "5":
        return r === 5;
      case "4-5":
        return r >= 4 && r < 5;
      case "3-4":
        return r >= 3 && r < 4;
      case "2-3":
        return r >= 2 && r < 3;
      case "0-2":
        return r < 2;
      default:
        return true;
    }
  }

  function passesPlatformFilter(game) {
    if (platformFilter === "all") return true;
    const targetId = Number(platformFilter);
    return (game.platforms || []).some((p) => {
      const platform = p.platform || p;
      return platform && platform.id === targetId;
    });
  }

  function passesGenreFilter(game) {
    if (genreFilter === "all") return true;
    return (game.genres || []).some(
      (genre) => String(genre.id) === genreFilter
    );
  }

  const filteredGames = games.filter(
    (g) =>
      passesRatingFilter(g) &&
      passesPlatformFilter(g) &&
      passesGenreFilter(g)
  );

  async function addToLibrary(game, status = "wishlist") {
    if (!user) {
      setFeedback({
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

      // mark game/status as existing so buttons update immediately
      setGameStatuses((prev) => {
        const existing = prev[game.id] || {
          wishlist: false,
          favorite: false,
          played: false,
        };
        return {
          ...prev,
          [game.id]: {
            ...existing,
            [status]: true,
          },
        };
      });

      setFeedback({
        type: "success",
        text: `${game.name} added to your ${status} list.`,
      });
    } catch (err) {
      console.error(err);
      setFeedback({
        type: "error",
        text:
          err.response?.data?.error ||
          "Failed to add game to your library.",
      });
    }
  }

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Top Rated Games</h1>

        <div className="search-filters">
          {/* Rating filter */}
          <label>
            Rating:
            <select
              value={ratingFilter}
              onChange={(e) => {
                const value = e.target.value;
                setRatingFilter(value);
                setPage(1);
                syncSearchParams({ page: 1, rating: value });
              }}
            >
              <option value="all">All</option>
              <option value="5">5★</option>
              <option value="4-5">4★ to &lt; 5★</option>
              <option value="3-4">3★ to &lt; 4★</option>
              <option value="2-3">2★ to &lt; 3★</option>
              <option value="0-2">0★ to &lt; 2★</option>
            </select>
          </label>

          {/* Platform filter */}
          <label>
            Platform:
            <select
              value={platformFilter}
              onChange={(e) => {
                const value = e.target.value;
                setPlatformFilter(value);
                setPage(1);
                syncSearchParams({ page: 1, platform: value });
              }}
            >
              <option value="all">All</option>
              {platformOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {/* Genre filter */}
          <label>
            Genre:
            <select
              value={genreFilter}
              onChange={(e) => {
                const value = e.target.value;
                setGenreFilter(value);
                setPage(1);
                syncSearchParams({ page: 1, genre: value });
              }}
            >
              <option value="all">All</option>
              {genreOptions.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {feedback && (
        <p className={`alert ${feedback.type}`}>
          {feedback.text}
        </p>
      )}

      {loading && <p>Loading…</p>}
      {error && <p className="alert error">{error}</p>}
      {!loading && filteredGames.length === 0 && <p>No results</p>}

      <div className="search-results-card">
        <div className="game-grid">
          {filteredGames.map((g) => {
            const statuses = gameStatuses[g.id] || {
              wishlist: false,
              favorite: false,
              played: false,
            };

            return (
              <div key={g.id} className="game-card">
                <img
                  src={g.background_image || "/images/no-image.png"}
                  alt={g.name}
                />
                <div className="game-card-body">
                  <h3>
                    <Link to={`/games/${g.id}`}>
                      {g.name}
                    </Link>
                  </h3>
                  <div className="game-meta">
                    <p>
                      <strong>Platforms: </strong>
                      {(g.platforms || [])
                        .map((p) => p.platform?.name || p.name)
                        .join(", ") || "Unknown Platform"}
                    </p>
                    <p>
                      <strong>Genre: </strong>
                      {(g.genres || [])
                        .map((genre) => genre.name)
                        .join(", ") || "Unknown Genre"}
                    </p>
                    <p>
                      ⭐ {g.rating ?? "N/A"}
                    </p>
                  </div>

                  {user ? (
                    <div className="game-actions">
                      <button
                        onClick={() => addToLibrary(g, "wishlist")}
                        disabled={statuses.wishlist}
                      >
                        {statuses.wishlist ? "In Wishlist" : "Wishlist"}
                      </button>
                      <button
                        onClick={() => addToLibrary(g, "favorite")}
                        disabled={statuses.favorite}
                      >
                        {statuses.favorite ? "In Favorites" : "Favorite"}
                      </button>
                      <button
                        onClick={() => addToLibrary(g, "played")}
                        disabled={statuses.played}
                      >
                        {statuses.played ? "In Played" : "Played"}
                      </button>
                    </div>
                  ) : (
                    <p className="game-hint">
                      <Link to="/login">Login</Link> or{" "}
                      <Link to="/register">Register</Link> to add this game
                      to your Wishlist, Favorites or Played list.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => updatePage(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => updatePage(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}