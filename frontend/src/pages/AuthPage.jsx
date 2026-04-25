import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../App";

const CONTENT = {
  login: {
    heading: "Welcome back",
    sub: "Sign in to browse restaurants, track orders, and manage your cart.",
    btn: "Sign in",
    alt: "Don't have an account?",
    altLink: "/signup", altLabel: "Create one",
  },
  signup: {
    heading: "Create account",
    sub: "Join ByteBite to start ordering from the best restaurants near you.",
    btn: "Create account",
    alt: "Already have an account?",
    altLink: "/login", altLabel: "Sign in",
  },
};

export default function AuthPage({ mode }) {
  const config = CONTENT[mode];
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
        showToast("Welcome back! 👋", "success");
      } else {
        await signup(form);
        showToast("Account created! Let's eat 🍽", "success");
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{
      minHeight: "calc(100vh - 62px)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      overflow: "hidden",
    }}
      className="auth-grid"
    >
      {/* Left panel – brand */}
      <div style={{
        background: "var(--ember)",
        padding: "60px 56px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", width: 400, height: 400,
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)",
          top: -120, right: -120,
        }} />
        <div style={{
          position: "absolute", width: 600, height: 600,
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)",
          top: -200, right: -200,
        }} />
        <div style={{
          position: "absolute", width: 300, height: 300,
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)",
          bottom: -80, left: -80,
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{
            fontFamily: "'Fraunces', serif", fontWeight: 900,
            fontSize: 36, color: "white", letterSpacing: "-0.04em",
          }}>ByteBite</span>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{
            fontFamily: "'Fraunces', serif", fontStyle: "italic",
            fontWeight: 700, fontSize: "clamp(28px, 3vw, 42px)",
            color: "white", lineHeight: 1.2, marginBottom: 24,
          }}>
            "Good food deserves a great experience."
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {[["100+", "Restaurants"], ["4.8★", "Avg rating"], ["30 min", "Avg delivery"]].map(([v, l]) => (
              <div key={l}>
                <p style={{ fontWeight: 700, fontSize: 22, color: "white", letterSpacing: "-0.03em" }}>{v}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 56px",
        background: "var(--bg-primary)",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <span className="badge badge-muted" style={{ marginBottom: 24, display: "inline-flex" }}>
            {mode === "login" ? "Sign in" : "Sign up"}
          </span>
          <h1 className="display" style={{ fontSize: 36, marginBottom: 10 }}>{config.heading}</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 36, lineHeight: 1.6 }}>
            {config.sub}
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && (
              <>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Full name</label>
                  <input className="input" placeholder="Adyasha Panda" value={form.name} onChange={set("name")} required />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Phone</label>
                  <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
                </div>
              </>
            )}

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email</label>
              <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  className="input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
                    padding: 4,
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: "12px 16px", background: "rgba(220,38,38,0.08)",
                border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10,
                color: "#dc2626", fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{ marginTop: 6, justifyContent: "center", width: "100%", padding: "13px" }}
            >
              {submitting ? "Please wait..." : (
                <>
                  {config.btn}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p style={{ marginTop: 28, fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
            {config.alt}{" "}
            <Link to={config.altLink} style={{ color: "var(--ember)", fontWeight: 600, textDecoration: "none" }}>
              {config.altLabel}
            </Link>
          </p>

          {/* Demo credentials */}
          <div style={{
            marginTop: 28, padding: "14px 16px",
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            borderRadius: 12, fontSize: 12,
          }}>
            <p style={{ fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Demo credentials</p>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
              Admin: admin@bytebite.dev / Admin@123<br />
              User: user@bytebite.dev / User@123
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-grid > div:first-child { display: none !important; }
          .auth-grid > div:last-child { padding: 40px 24px !important; min-height: calc(100vh - 62px); }
        }
      `}</style>
    </main>
  );
}