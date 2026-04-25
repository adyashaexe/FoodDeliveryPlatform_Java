import { Plus, Check, Leaf, Zap } from "lucide-react";
import { formatCurrency } from "../utils/currency";

export default function MenuItemCard({ item, onAdd, disabled, adding }) {
  return (
    <div className="card card-hover" style={{ padding: 18, display: "flex", gap: 14, alignItems: "flex-start" }}>
      {/* Item image or emoji placeholder */}
      <div style={{
        width: 72, height: 72, borderRadius: 12, flexShrink: 0,
        background: "var(--bg-secondary)",
        backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined,
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32,
      }}>
        {!item.imageUrl && "🍽"}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
          <h3 style={{
            fontSize: 15, fontWeight: 600, color: "var(--text-primary)",
            lineHeight: 1.3, flex: 1,
          }}>
            {item.name}
          </h3>
          <p style={{
            fontFamily: "'Fraunces', serif", fontWeight: 700,
            fontSize: 17, color: "var(--ember)", letterSpacing: "-0.02em",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>
            {formatCurrency(item.price)}
          </p>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 5, marginBottom: 7, flexWrap: "wrap" }}>
          {item.veg && (
            <span className="badge badge-green">
              <Leaf size={10} /> Veg
            </span>
          )}
          {item.bestseller && (
            <span className="badge badge-amber">
              <Zap size={10} /> Bestseller
            </span>
          )}
          {item.category && (
            <span className="badge badge-muted">{item.category}</span>
          )}
        </div>

        {item.description && (
          <p style={{
            fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.6,
            marginBottom: 12,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {item.description}
          </p>
        )}

        <button
          onClick={onAdd}
          disabled={disabled || !item.available || adding}
          className="btn-primary"
          style={{
            padding: "7px 16px",
            fontSize: 12.5,
            background: adding ? "#16a34a" : undefined,
            boxShadow: adding ? "0 4px 16px rgba(22,163,74,0.3)" : undefined,
            transition: "all 0.25s ease",
          }}
        >
          {adding ? (
            <><Check size={13} /> Added</>
          ) : item.available ? (
            <><Plus size={13} /> Add to cart</>
          ) : (
            "Unavailable"
          )}
        </button>
      </div>
    </div>
  );
}