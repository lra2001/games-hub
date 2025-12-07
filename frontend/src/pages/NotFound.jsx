import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="auth-container notfound-card">
      <div className="auth-card">
        <img src="/images/404-gamer.png" alt="Panicking gamer - page not found" className="notfound-image shake-once"/>

        <h2>Page not found</h2>

        <div className="info">
            <p>
            Uh Oh! Seems like you played the wrong move and landed on the nothing page!
            But don't worry, you can always go back to the homepage and start again!
            </p>
        </div>

        <div>
            <Link to="/" className="btn-primary">
            Take me back Home!!!
            </Link>
        </div>

      </div>
    </div>
  );
}
