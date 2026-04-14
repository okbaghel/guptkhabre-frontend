"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const res = await login(form);

  setLoading(false);

  if (res.success) {
    router.push("/admin/dashboard"); // ✅ use replace
  } else {
    setError(res.message || "Login failed");
  }
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background: #050608;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Sora', sans-serif;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        /* Ambient background blobs */
        .login-root::before {
          content: '';
          position: fixed;
          top: -30%;
          left: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-root::after {
          content: '';
          position: fixed;
          bottom: -20%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(99, 37, 235, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .card {
          width: 100%;
          max-width: 400px;
          background: #0c0d11;
          border: 1px solid #1a1d26;
          border-radius: 20px;
          padding: 40px 36px;
          position: relative;
          z-index: 1;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset;
          animation: cardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        /* Top accent line */
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent);
          border-radius: 999px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 999px;
          color: #818cf8;
          font-size: 10px;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .badge-dot {
          width: 5px; height: 5px;
          background: #818cf8;
          border-radius: 50%;
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.8); }
        }

        .heading {
          font-size: 26px;
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }
        .subheading {
          font-size: 13px;
          color: #3d4251;
          margin-bottom: 32px;
          font-family: 'IBM Plex Mono', monospace;
        }

        .error-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          color: #fca5a5;
          font-size: 13px;
          margin-bottom: 20px;
          animation: shake 0.3s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-6px); }
          75%      { transform: translateX(6px); }
        }

        .field {
          margin-bottom: 16px;
        }
        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #3d4251;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: 'IBM Plex Mono', monospace;
          margin-bottom: 7px;
        }
        .input-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #2a2d3a;
          font-size: 15px;
          pointer-events: none;
          transition: color 0.2s;
        }
        .field-input {
          width: 100%;
          padding: 11px 14px 11px 38px;
          background: #080a0e;
          border: 1px solid #1a1d26;
          border-radius: 11px;
          color: #e2e8f0;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        .field-input::placeholder { color: #2a2d3a; }
        .field-input:focus {
          outline: none;
          border-color: #3730a3;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }
        .field-input:focus + .focus-ring,
        .input-wrap:focus-within .input-icon { color: #6366f1; }

        .eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #3d4251;
          cursor: pointer;
          font-size: 16px;
          padding: 2px;
          line-height: 1;
          transition: color 0.15s;
        }
        .eye-btn:hover { color: #6366f1; }

        .submit-btn {
          width: 100%;
          margin-top: 8px;
          padding: 13px;
          border-radius: 12px;
          border: none;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: opacity 0.2s, transform 0.15s;
          background: linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%);
          color: #fff;
          box-shadow: 0 4px 20px rgba(99,102,241,0.25);
          letter-spacing: 0.01em;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.35);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          height: 1px;
          background: #12141b;
          margin: 28px 0 20px;
        }
        .footer-text {
          text-align: center;
          font-size: 11px;
          color: #1e2130;
          font-family: 'IBM Plex Mono', monospace;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="login-root">
        <div className="card">
          <div className="badge">
            <span className="badge-dot" />
            Admin Access
          </div>

          <h1 className="heading">Welcome back</h1>
          <p className="subheading">Sign in to your dashboard</p>

          {error && (
            <div className="error-box">
              <span>⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label" htmlFor="email">Email</label>
              <div className="input-wrap">
                <span className="input-icon">✉</span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  className="field-input"
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••••"
                  className="field-input"
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Signing in…
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="divider" />
          <p className="footer-text">SECURED · ADMIN PORTAL</p>
        </div>
      </div>
    </>
  );
}