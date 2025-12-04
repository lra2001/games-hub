import { Link } from "react-router-dom";

export default function LibraryPage({ status, items = [], onRemove }) {
  const filtered = items.filter((item) => item.status === status);
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div>
      <h2>{label}</h2>

      {filtered.length === 0 && <p>No games added yet.</p>}

      {filtered.length > 0 && (
        <div className="search-results-card">
          <div className="game-grid">
            {filtered.map((item) => (
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
                    <p className="game-meta">
                      Status: {label}
                      {item.rating ? ` · ⭐ ${item.rating}` : ""}
                    </p>
                  </div>
                </Link>

                <div className="game-actions">
                  <button
                    className="danger"
                    onClick={() => onRemove(item.id)}
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