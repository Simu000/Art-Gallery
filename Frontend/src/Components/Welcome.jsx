import { useNavigate } from "react-router-dom";
import "./Welcome.css";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-bg" />

      <div className="welcome-container">
        <div className="welcome-card fade-up">

          <span className="section-label">aborginal art gallery</span>

          <h1 className="welcome-card__title">
            Welcome to the <em>aborginal art gallery</em>
          </h1>

          <p className="welcome-card__subtitle">
            Discover rare artworks, living artists, and curated exhibitions
            spanning centuries of craft and tradition.
          </p>

          <div className="welcome-card__divider" />

          <div className="welcome-card__actions">
            <button
              className="welcome-btn welcome-btn--primary"
              onClick={() => navigate("/signin")}
            >
              Create Account
            </button>

            <button
              className="welcome-btn welcome-btn--outline"
              onClick={() => navigate("/login")}
            >
              Existing User? Sign In
            </button>
          </div>

          <p className="welcome-card__footer">
            By continuing you agree to our{" "}
            <span className="welcome-card__link">Terms of Use</span> &amp;{" "}
            <span className="welcome-card__link">Privacy Policy</span>
          </p>

        </div>
      </div>
    </div>
  );
}
