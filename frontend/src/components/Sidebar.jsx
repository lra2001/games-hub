import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/dashboard/favorites">Favorites</NavLink>
        <NavLink to="/dashboard/wishlist">Wishlist</NavLink>
        <NavLink to="/dashboard/reviews">Reviews</NavLink>
      </nav>
    </aside>
  );
}