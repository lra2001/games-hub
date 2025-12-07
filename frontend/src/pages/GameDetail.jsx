import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../auth/AuthContext.jsx";
import useLibraryActions from "../hooks/useLibraryActions.js";

export default function GameDetail() {
  // Get game ID from URL params
  const { id } = useParams();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const prevQuery = searchParams.get("query");
  const prevPage = searchParams.get("page");
  const navigate = useNavigate();

  const {addToLibrary: addToLibraryApi, feedback, setFeedback, } = useLibraryActions();

  // Game detail states
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Media states
  const [media, setMedia] = useState({
    screenshots: [],
    trailers: [],
    youtube: [],
  });
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState(null);

  // Tab state
  const [activeTab, setActiveTab] = useState("overview");

  // Library status states
  const [addingStatus, setAddingStatus] = useState(null);
  const [libraryStatuses, setLibraryStatuses] = useState({
    wishlist: false,
    favorite: false,
    played: false,
  });

    useEffect(() => {
    setFeedback(null);
  }, [id, setFeedback]);

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

  // Load screenshots / trailers / youtube
  useEffect(() => {
    async function loadMedia() {
      setMediaLoading(true);
      setMediaError(null);
      try {
        const res = await api.get(`games/${id}/media/`);
        setMedia({
          screenshots: res.data.screenshots || [],
          trailers: res.data.trailers || [],
          youtube: res.data.youtube || [],
        });
      } catch (err) {
        console.error(err);
        setMediaError("Failed to load media.");
      } finally {
        setMediaLoading(false);
      }
    }
    loadMedia();
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
    if (!game) return;
    setAddingStatus(status);
    setFeedback(null);

    const ok = await addToLibraryApi(game, status);
    setAddingStatus(null);

    if (!ok) return;

    setLibraryStatuses((prev) => ({
      ...prev,
      [status]: true,
    }));
  }

  if (loading) return <p>Loading game…</p>;
  if (error) return <p className="alert error">{error}</p>;
  if (!game) return null;

  const { wishlist, favorite, played } = libraryStatuses;
  const { screenshots, trailers, youtube } = media;
  const hasVideos = (trailers && trailers.length > 0) || (youtube && youtube.length > 0);

  return (
    <div className="game-detail-page">
      <div className="game-detail-card">
        <div className="game-detail-topbar">
          {prevQuery ? (
            <Link
              to={`/search?query=${encodeURIComponent(prevQuery)}${
                prevPage ? `&page=${prevPage}` : ""
              }`}
            >
              ← Back to search
            </Link>
          ) : (
            <button
              type="button"
              className="back-button"
              onClick={() => {
                if (window.history.length > 2) navigate(-1);
                else navigate("/");
              }}
            >
              ← Back to Previous Page
            </button>
          )}
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
                <strong>Platforms:</strong>{" "}
                {game.platforms && game.platforms.length > 0
                  ? game.platforms
                      .map((p) => p.platform.name)
                      .join(", ")
                  : "Unknown"}
              </p>
              <p>
                <strong>Genre:</strong>{" "}
                {game.genres && game.genres.length > 0
                  ? game.genres.map((g) => g.name).join(", ")
                  : "Unknown"}
              </p>
              <p>
                <strong>Released:</strong>{" "}
                {game.released ?? "Unknown"}
              </p>
              <p>
                ⭐{" "}
                {game.rating ?? "N/A"}
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

        {/* Tabs */}
        <div className="game-detail-tabs">
          <button
            type="button"
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            className={`tab ${activeTab === "screenshots" ? "active" : ""}`}
            onClick={() => setActiveTab("screenshots")}
          >
            Screenshots
          </button>
          <button
            type="button"
            className={`tab ${activeTab === "videos" ? "active" : ""}`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
        </div>

        {/* Tab content */}
        <div className="game-detail-tab-content">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <>
              {game.description_raw ? (
                <div className="game-detail-description">
                  <h3>Description</h3>
                  <p>{game.description_raw}</p>
                </div>
              ) : (
                <p className="game-detail-login-hint">
                  No description available for this game.
                </p>
              )}
            </>
          )}

          {/* SCREENSHOTS TAB */}
          {activeTab === "screenshots" && (
            <div className="game-detail-media">
              {mediaLoading && <p>Loading screenshots…</p>}
              {mediaError && <p className="alert error">{mediaError}</p>}

              {(!mediaLoading && screenshots.length === 0) && (
                <p>No screenshots available.</p>
              )}

              {screenshots.length > 0 && (
                <section className="media-block">
                  <div className="screenshot-grid">
                    {screenshots.map((shot) => (
                      <img
                        key={shot.id || shot.image}
                        src={shot.image}
                        alt={`${game.name} screenshot`}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* VIDEOS TAB */}
          {activeTab === "videos" && (
            <div className="game-detail-media">
              {mediaLoading && <p>Loading videos…</p>}
              {mediaError && <p className="alert error">{mediaError}</p>}

              {!mediaLoading && !hasVideos && (
                <p>No trailers or videos available.</p>
              )}

              {trailers.length > 0 && (
                <section className="media-block">
                  <h3>Trailers</h3>
                  <div className="trailer-list">
                    {trailers.map((tr) => {
                      const videoUrl =
                        tr.data?.max ||
                        tr.data?.["480"] ||
                        tr.preview ||
                        null;

                      return (
                        <div key={tr.id} className="trailer-item">
                          <p>{tr.name}</p>
                          {videoUrl && (
                            <video
                              controls
                              src={videoUrl}
                              className="trailer-video"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {youtube.length > 0 && (
                <section className="media-block">
                  <h3>Related YouTube Videos</h3>
                  <div className="youtube-grid">
                    {youtube.slice(0, 4).map((vid) => (
                      <div key={vid.id} className="youtube-item">
                        <p>{vid.name}</p>
                        <div className="youtube-frame-wrapper">
                          <iframe
                            src={`https://www.youtube.com/embed/${vid.external_id}`}
                            title={vid.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}