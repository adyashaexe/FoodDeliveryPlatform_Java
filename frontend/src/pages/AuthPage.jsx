import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const MODE_CONTENT = {
  login: {
    title: "Welcome back",
    subtitle: "Jump into live menus, fast reorders, and real checkout flows.",
    button: "Login",
    alternateText: "Need an account?",
    alternateLink: "/signup",
    alternateLabel: "Create one",
  },
  signup: {
    title: "Build your account",
    subtitle: "Create a customer account and start placing real API-powered orders.",
    button: "Create account",
    alternateText: "Already have an account?",
    alternateLink: "/login",
    alternateLabel: "Login",
  },
};

export default function AuthPage({ mode }) {
  const config = MODE_CONTENT[mode];
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong while authenticating.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-shell grid min-h-[calc(100vh-120px)] items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="paper-card relative overflow-hidden p-8 lg:p-12">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-coral/10 blur-2xl" />
        <p className="pill inline-block bg-basil/10 text-basil">Full-stack demo</p>
        <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-ink">
          Ship a food delivery app that looks and feels production-ready.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
          This frontend is wired for JWT auth, live restaurant queries, cart actions, orders, and admin controls.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Stat label="Auth" value="JWT login/signup" />
          <Stat label="Customer" value="Browse, cart, order" />
          <Stat label="Admin" value="Restaurant control" />
        </div>
      </section>

      <section className="paper-card p-8 lg:p-10">
        <p className="pill inline-block bg-coral/10 text-coral">{mode}</p>
        <h2 className="mt-4 font-display text-4xl font-bold text-ink">{config.title}</h2>
        <p className="mt-3 text-sm leading-7 text-stone-600">{config.subtitle}</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <input
                className="soft-input"
                placeholder="Full name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
              <input
                className="soft-input"
                placeholder="Phone"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </>
          )}

          <input
            type="email"
            className="soft-input"
            placeholder="Email address"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <input
            type="password"
            className="soft-input"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />

          {error && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm text-berry">{error}</p>}

          <button type="submit" className="primary-button w-full" disabled={submitting}>
            {submitting ? "Please wait..." : config.button}
          </button>
        </form>

        <p className="mt-6 text-sm text-stone-500">
          {config.alternateText}{" "}
          <Link to={config.alternateLink} className="font-semibold text-coral">
            {config.alternateLabel}
          </Link>
        </p>
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-[24px] bg-stone-50 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{label}</p>
      <p className="mt-2 font-semibold text-ink">{value}</p>
    </div>
  );
}
