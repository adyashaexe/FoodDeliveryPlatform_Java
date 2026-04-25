import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, MapPin, ShoppingBag, Star, IndianRupee, ArrowLeft, Check } from "lucide-react";
import api from "../api/client";
import MenuItemCard from "../components/MenuItemCard";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";
import { showToast } from "../App";

export default function RestaurantPage() {
  const { restaurantId } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [adding, setAdding] = useState(null);

  useEffect(() => { fetchRestaurant(); }, [restaurantId]);

  async function fetchRestaurant() {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/restaurants/${restaurantId}`);
      setDetails(data);
    } catch {
      setError("Could not load restaurant details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(menuItemId, itemName) {
    if (!isAuthenticated) { navigate("/login"); return; }
    try {
      setAdding(menuItemId);
      await addToCart(menuItemId, 1);
      showToast(`${itemName} added to cart`, "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Could not add item", "error");
    } finally {
      setTimeout(() => setAdding(null), 800);
    }
  }

  if (loading) return (
    <main className="page-shell">
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="skeleton" style={{ height: 280 }} />
        <div style={{ padding: 32 }}>
          <div className="skeleton" style={{ height: 14, width: "30%", marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 36, width: "60%", marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 16, width: "80%" }} />
        </div>
      </div>
    </main>
  );

  if (!details) return (
    <main className="page-shell">
      <div className="card" style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "#dc2626", fontSize: 14 }}>{error}</p>
      </div>
    </main>
  );

  const { restaurant, menu } = details;
  const categories = ["All", ...new Set(menu.map(i => i.category).filter(Boolean))];
  const filtered = activeCategory === "All" ? menu : menu.filter(i => i.category === activeCategory);

  return (
    <main className="page-shell" style={{ paddingTop: 28 }}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="btn-ghost"
        style={{ marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 7 }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Hero card */}
      <div className="card fade-up" style={{ overflow: "hidden", marginBottom: 28 }}>
        <div style={{
          height: 260, position: "relative", overflow: "hidden",
          background: `linear-gradient(135deg, #1a1612 0%, #2e2218 100%)`,
          backgroundImage: restaurant.imageUrl
            ? `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(${restaurant.imageUrl})`
            : undefined,
          backgroundSize: "cover", backgroundPosition: "center",
        }}>
          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)",
          }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 32px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
              <div>
                <span className="badge badge-ember" style={{ marginBottom: 10 }}>
                  {restaurant.cuisine}
                </span>
                <h1 style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 900,
                  fontSize: "clamp(28px, 4vw, 48px)", color: "white",
                  letterSpacing: "-0.03em", lineHeight: 1.1,
                }}>{restaurant.name}</h1>
              </div>
              <div style={{
                background: restaurant.open ? "rgba(22,163,74,0.85)" : "rgba(100,100,100,0.8)",
                backdropFilter: "blur(8px)",
                padding: "6px 14px", borderRadius: 10,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {restaurant.open && <span className="pulse-dot" />}
                <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
                  {restaurant.open ? "Open now" : "Closed"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info row */}
        <div style={{ padding: "20px 32px", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <InfoChip icon={<Star size={14} style={{ color: "#c9922a" }} />}
              label={`${restaurant.rating?.toFixed(1)} rating`} />
            <InfoChip icon={<Clock size={14} style={{ color: "var(--ember)" }} />}
              label={`${restaurant.deliveryTimeMinutes} min`} />
            <InfoChip icon={<IndianRupee size={14} />}
              label={`${formatCurrency(restaurant.deliveryFee)} delivery`} />
            <InfoChip icon={<MapPin size={14} />}
              label={`${restaurant.address}, ${restaurant.city}`} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div>
              <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Min. order
              </span>
              <p style={{
                fontFamily: "'Fraunces', serif", fontWeight: 700,
                fontSize: 22, color: "var(--ember)", letterSpacing: "-0.03em",
              }}>
                {formatCurrency(restaurant.minOrderAmount)}
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => navigate("/cart")}
              style={{ position: "relative" }}
            >
              <ShoppingBag size={15} />
              Cart
              {(cart.items?.length || 0) > 0 && (
                <span className="cart-badge" style={{ top: -8, right: -8 }}>
                  {cart.items.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {restaurant.description && (
          <div style={{ padding: "0 32px 20px", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>{restaurant.description}</p>
          </div>
        )}
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 24, scrollbarWidth: "none" }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "7px 18px", borderRadius: 10, whiteSpace: "nowrap",
              border: activeCategory === cat ? "1.5px solid var(--ember)" : "1px solid var(--border)",
              background: activeCategory === cat ? "var(--ember-dim)" : "var(--bg-card)",
              color: activeCategory === cat ? "var(--ember)" : "var(--text-secondary)",
              fontSize: 13, fontWeight: activeCategory === cat ? 600 : 400,
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu grid */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>No items in this category.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {filtered.map((item, i) => (
            <div key={item.id} className="fade-up" style={{ animationDelay: `${i * 0.05}s`, animationDuration: "0.35s" }}>
              <MenuItemCard
                item={item}
                adding={adding === item.id}
                onAdd={() => handleAdd(item.id, item.name)}
                disabled={!restaurant.open}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function InfoChip({ icon, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
      <span style={{ color: "var(--text-muted)" }}>{icon}</span>
      {label}
    </div>
  );
}