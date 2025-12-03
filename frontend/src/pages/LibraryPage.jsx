import { Link } from "react-router-dom";
export default function LibraryPage({ items, status, onRemove }) {
  const filtered = items.filter((item) => item.status === status);
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div>
      <h2>{label}</h2>

      {filtered.length === 0 && <p>No games added yet.</p>}

      <ul>
        {filtered.map((item) => (
          <li key={item.id}>
            {item.background_image && (
              <img
                src={item.background_image}
                alt={item.title}
                width={80}
                style={{ marginRight: "0.5rem" }}
              />
            )}

            <strong>
              <Link to={`/games/${item.game_id}`}>
                {item.title || `Game #${item.game_id}`}
              </Link>
            </strong>

            <button
              onClick={() => onRemove(item.id)}
              style={{ marginLeft: "0.5rem" }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}