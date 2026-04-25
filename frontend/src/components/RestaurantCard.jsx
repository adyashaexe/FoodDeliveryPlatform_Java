import { Link } from "react-router-dom";
import { Clock, Star, IndianRupee, MapPin } from "lucide-react";
import { formatCurrency } from "../utils/currency";

export default function RestaurantCard({ restaurant }) {
  const imgFallback = `https://source.unsplash.com/400x200/?food,restaurant,${restaurant.cuisine}`;

  return (
    <article className="card card-hover" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Image */}
      <div style={{ position: "relative", height: 180, overflow: "hidden", flexShrink: 0 }}>
        <div
          style={{
            width: "100%", height: "100%",
            backgroundImage: `url(${restaurant.imageUrl || imgFallback})`,
            backgroundSize: "cover", backgroundPosition: "center",
            transition: "transform 0.4s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
        {/* Overlay gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
        }} />

        {/* Status badge */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          display: "flex", alignItems: "center", gap: 5,
          padding: "4px 10px", borderRadius: 8,
          background: restaurant.open ? "rgba(22,163,74,0.9)" : "rgba(100,100,100,0.9)",
          backdropFilter: "blur(8px)",
        }}>
          {restaurant.open && <span className="pulse-dot" style={{ width: 6, height: 6 }} />}
          <span style={{ fontSize: 11, fontWeight: 600, color: "white", letterSpacing: "0.04em" }}>
            {restaurant.open ? "Open" : "Closed"}
          </span>
        </div>

        {/* Cuisine */}
        <div style={{ position: "absolute", bottom: 12, left: 12 }}>
          <span className="badge badge-ember" style={{ backdropFilter: "blur(8px)", background: "rgba(232,69,10,0.85)" }}>
            {restaurant.cuisine}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 700,
            fontSize: 22, color: "var(--text-primary)",
            letterSpacing: "-0.02em", lineHeight: 1.2,
            marginBottom: 6,
          }}>
            {restaurant.name}
          </h3>
          <p style={{
            fontSize: 13, color: "var(--text-muted)",
            lineHeight: 1.6, marginBottom: 16,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {restaurant.description}
          </p>

          {/* Meta row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <MetaChip icon={<Star size={13} style={{ color: "#c9922a" }} />}
              value={restaurant.rating?.toFixed(1) || "–"} />
            <MetaChip icon={<Clock size={13} style={{ color: "var(--ember)" }} />}
              value={`${restaurant.deliveryTimeMinutes} min`} />
            <MetaChip icon={<IndianRupee size={13} style={{ color: "var(--text-muted)" }} />}
              value={`${formatCurrency(restaurant.deliveryFee)} delivery`} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 18 }}>
            <MapPin size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{restaurant.city}</span>
          </div>
        </div>

        <Link
          to={`/restaurants/${restaurant.id}`}
          className="btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
        >
          View Menu
        </Link>
      </div>
    </article>
  );
}

function MetaChip({ icon, value }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 8,
      background: "var(--bg-secondary)",
      fontSize: 12, fontWeight: 500,
      color: "var(--text-secondary)",
    }}>
      {icon}
      {value}
    </div>
  );
}