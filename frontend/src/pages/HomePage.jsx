import { Search, Flame, Clock, Star, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import RestaurantCard from "../components/RestaurantCard";

const CUISINES = ["All", "Indian", "Chinese", "Italian", "American", "Mexican", "Thai", "Japanese"];

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  async function fetchRestaurants(searchTerm = "") {
    try {
      setLoading(true);
      const params = searchTerm ? { q: searchTerm } : {};
      const { data } = await api.get("/api/restaurants", { params });
      setRestaurants(data);
      setError("");
    } catch {
      setError("Unable to load restaurants right now.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchRestaurants(query);
  }

  const filtered = activeCuisine === "All"
    ? restaurants
    : restaurants.filter(r => r.cuisine?.toLowerCase().includes(activeCuisine.toLowerCase()));

  return (
    <main className="page-shell" style={{ paddingTop: 40 }}>

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section style={{ marginBottom: 56 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 24,
          alignItems: "start",
          marginBottom: 32,
        }}>
          <div>
            <div className="badge badge-ember fade-up" style={{ marginBottom: 16 }}>
              <Flame size={11} />
              Hot &amp; Fresh
            </div>
            <h1 className="display fade-up fade-up-d1"
              style={{ fontSize: "clamp(40px, 6vw, 72px)", maxWidth: 640 }}>
              Great food,<br />
              <span className="display-italic">delivered fast.</span>
            </h1>
            <p className="fade-up fade-up-d2" style={{
              fontSize: 17, color: "var(--text-secondary)", marginTop: 16,
              lineHeight: 1.7, maxWidth: 480,
            }}>
              Browse the best restaurants in your city, build your cart, and track every order in real time.
            </p>
          </div>

          {/* Stats panel */}
          <div className="card fade-up fade-up-d2" style={{ padding: "24px 28px", minWidth: 200 }}>
            {[
              { val: restaurants.length || "–", label: "Restaurants" },
              { val: "30 min", label: "Avg delivery" },
              { val: "4.8★", label: "Avg rating" },
            ].map((s, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 20 : 0 }}>
                <p style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 900,
                  fontSize: 32, color: "var(--ember)", letterSpacing: "-0.04em", lineHeight: 1,
                }}>{s.val}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="fade-up fade-up-d3"
          style={{ display: "flex", gap: 10, maxWidth: 560 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={16} style={{
              position: "absolute", left: 14, top: "50%",
              transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none",
            }} />
            <input
              className="input"
              style={{ paddingLeft: 42 }}
              placeholder="Search restaurants or cuisines..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </section>

      {/* ─── Cuisine filter ───────────────────────────────────── */}
      <div className="fade-up fade-up-d4" style={{
        display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4,
        marginBottom: 36, scrollbarWidth: "none",
      }}>
        {CUISINES.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCuisine(c)}
            style={{
              padding: "7px 18px",
              borderRadius: 10,
              border: activeCuisine === c ? "1.5px solid var(--ember)" : "1px solid var(--border)",
              background: activeCuisine === c ? "var(--ember-dim)" : "var(--bg-card)",
              color: activeCuisine === c ? "var(--ember)" : "var(--text-secondary)",
              fontSize: 13, fontWeight: activeCuisine === c ? 600 : 400,
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ─── Error ────────────────────────────────────────────── */}
      {error && (
        <div style={{
          padding: "14px 18px", background: "rgba(220,38,38,0.08)",
          border: "1px solid rgba(220,38,38,0.2)", borderRadius: 12,
          color: "#dc2626", fontSize: 14, marginBottom: 24,
        }}>
          {error}
        </div>
      )}

      {/* ─── Restaurant grid ──────────────────────────────────── */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="skeleton" style={{ height: 180 }} />
              <div style={{ padding: 20 }}>
                <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 22, width: "80%", marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: "90%", marginBottom: 16 }} />
                <div className="skeleton" style={{ height: 36, borderRadius: 10 }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🍽</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>No restaurants found</p>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6 }}>Try a different cuisine or search term</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {filtered.length} restaurant{filtered.length !== 1 ? "s" : ""} available
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
            {filtered.map((r, i) => (
              <div
                key={r.id}
                className="fade-up"
                style={{ animationDelay: `${i * 0.06}s`, animationDuration: "0.4s" }}
              >
                <RestaurantCard restaurant={r} />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}