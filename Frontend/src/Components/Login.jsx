import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { onLoginSuccess } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", otp: "" });
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

    if (!otpStep && (!form.email.trim() || !form.password)) {
      setError("Please fill in all fields.");
      return;
    }

    if (otpStep && form.otp.trim().length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      if (!otpStep) {
        const dto = {
          email: form.email.trim(),
          password: form.password,
        };
        const res = await auth.login(dto);
        if (!res?.requires2FA) {
          throw new Error("OTP was not initiated.");
        }
        setOtpEmail(form.email.trim());
        setOtpStep(true);
        setMessage(res.message || "OTP sent to your email.");
      } else {
        await auth.verifyOtpLogin({
          email: otpEmail.trim(),
          otp: form.otp.trim(),
        });
        await onLoginSuccess();
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
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
            <h1 className="auth-card__title">Sign In</h1>
            <p className="auth-card__subtitle">
              {otpStep
                ? "Enter the OTP sent to your email to finish sign in."
                : "Welcome back. Enter your credentials to continue."}
            </p>
          </div>

          <div className="auth-card__divider" />

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {!otpStep ? (
              <>
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
                  <div className="auth-label-row">
                    <label className="auth-label" htmlFor="password">Password</label>
                    <span className="auth-forgot">Two-step verification enabled</span>
                  </div>
                  <input
                    className="auth-input"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
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
              {loading ? "Please wait..." : otpStep ? "Verify OTP" : "Sign In"}
            </button>

          </form>

          <p className="auth-switch">
            Don&apos;t have an account?{" "}
            <Link to="/signin" className="auth-switch__link">Create one</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
