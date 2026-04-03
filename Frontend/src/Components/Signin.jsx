import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./Signin.css";

export default function Signin() {
  const navigate = useNavigate();
  const { onLoginSuccess } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", otp: "" });
  const [otpStep, setOtpStep] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otpStep && (!form.name.trim() || !form.email.trim() || !form.password || !form.confirm)) {
      setError("Please fill in all fields.");
      return;
    }

    if (!otpStep && form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!otpStep && form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (otpStep && form.otp.trim().length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      if (!otpStep) {
        const [firstName, ...rest] = form.name.trim().split(/\s+/);
        const lastName = rest.join(" ");
        const dto = {
          firstName,
          lastName,
          email: form.email.trim(),
          password: form.password,
        };
        const res = await auth.register(dto);
        setOtpEmail(res.email || form.email.trim());
        setOtpStep(true);
        setMessage(res.message || "OTP sent to your email.");
      } else {
        await auth.verifyOtpRegistration({
          email: otpEmail.trim(),
          otp: form.otp.trim(),
        });
        await onLoginSuccess();
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />

      <Link to="/welcome" className="auth-back">
        ← &nbsp;Back
      </Link>

      <div className="auth-container">
        <div className="auth-card fade-up">

          <div className="auth-card__top">
            <span className="section-label">aborginal art gallery</span>
            <h1 className="auth-card__title">Create Account</h1>
            <p className="auth-card__subtitle">
              {otpStep
                ? "Enter the OTP sent to your email to verify your account."
                : "Join aborginal art gallery. Explore art, connect with artists."}
            </p>
          </div>

          <div className="auth-card__divider" />

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {!otpStep ? (
              <>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="name">Full Name</label>
                  <input
                    className="auth-input"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label" htmlFor="email">Email Address</label>
                  <input
                    className="auth-input"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label" htmlFor="password">Password</label>
                  <input
                    className="auth-input"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label" htmlFor="confirm">Confirm Password</label>
                  <input
                    className="auth-input"
                    type="password"
                    id="confirm"
                    name="confirm"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
              </>
            ) : (
              <div className="auth-field">
                <label className="auth-label" htmlFor="otp">OTP Code</label>
                <input
                  className="auth-input"
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={form.otp}
                  onChange={handleChange}
                  maxLength={6}
                  inputMode="numeric"
                />
              </div>
            )}

            {message && <p className="auth-success">{message}</p>}
            {error && <p className="auth-error">{error}</p>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Please wait..." : otpStep ? "Verify OTP" : "Create Account"}
            </button>

          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login" className="auth-switch__link">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
