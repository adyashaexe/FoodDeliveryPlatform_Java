import { useEffect, useState } from "react";
import { ShieldCheck, Store, ClipboardList, Plus, ChevronDown } from "lucide-react";
import api from "../api/client";
import { formatCurrency } from "../utils/currency";
import { showToast } from "../App";

const INIT = {
  name: "", cuisine: "", city: "", address: "",
  description: "", imageUrl: "", rating: 4.5,
  deliveryTimeMinutes: 30, deliveryFee: 35,
  minOrderAmount: 199, open: true,
};

const ORDER_STATUSES = ["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

export default function AdminPage() {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [o, r] = await Promise.all([
        api.get("/api/admin/orders"),
        api.get("/api/restaurants"),
      ]);
      setOrders(o.data);
      setRestaurants(r.data);
    } catch {
      showToast("Could not load admin data", "error");
    } finally {
      setLoading(false);
    }
  }

  async function createRestaurant(e) {
    e.preventDefault();
    try {
      await api.post("/api/admin/restaurants", form);
      setForm(INIT);
      showToast("Restaurant created!", "success");
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || "Could not create restaurant", "error");
    }
  }

  async function updateStatus(orderId, status) {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status });
      showToast(`Order moved to ${status}`, "success");
      loadData();
    } catch {
      showToast("Could not update order status", "error");
    }
  }

  const stats = [
    { label: "Total orders", value: orders.length },
    { label: "Restaurants", value: restaurants.length },
    { label: "Open now", value: restaurants.filter(r => r.open).length },
    { label: "Revenue", value: formatCurrency(orders.reduce((s, o) => s + (o.totalAmount || 0), 0)) },
  ];

  return (
    <main className="page-shell fade-up" style={{ paddingTop: 36 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--ember-dim)", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <ShieldCheck size={18} style={{ color: "var(--ember)" }} />
          </div>
          <span className="badge badge-ember">Admin Dashboard</span>
        </div>
        <h1 className="display" style={{ fontSize: 42 }}>Marketplace control</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6 }}>
          Manage restaurants, menu items, and order flow.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 36 }}>
        {stats.map((s) => (
          <div key={s.label} className="card" style={{ padding: "18px 20px" }}>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6 }}>
              {s.label}
            </p>
            <p style={{
              fontFamily: "'Fraunces', serif", fontWeight: 900,
              fontSize: 30, color: "var(--ember)", letterSpacing: "-0.04em", lineHeight: 1,
            }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28, borderBottom: "1px solid var(--border)", paddingBottom: 2 }}>
        {[
          { key: "orders", label: "Orders", icon: <ClipboardList size={14} /> },
          { key: "restaurants", label: "Restaurants", icon: <Store size={14} /> },
          { key: "add", label: "Add Restaurant", icon: <Plus size={14} /> },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 18px", fontSize: 13.5, fontWeight: 500,
              background: "none", border: "none", cursor: "pointer",
              color: tab === t.key ? "var(--ember)" : "var(--text-muted)",
              borderBottom: tab === t.key ? "2px solid var(--ember)" : "2px solid transparent",
              marginBottom: -2, transition: "all 0.15s",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Orders */}
      {tab === "orders" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="card" style={{ padding: 20 }}>
                <div className="skeleton" style={{ height: 16, width: "40%", marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 14, width: "60%" }} />
              </div>
            ))
          ) : orders.length === 0 ? (
            <div className="card" style={{ padding: 48, textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)" }}>No orders yet.</p>
            </div>
          ) : orders.map((order) => (
            <div key={order.id} className="card" style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>
                      #{order.id}
                    </span>
                    <span className="badge badge-muted" style={{ fontSize: 10 }}>
                      {order.trackingCode}
                    </span>
                    <span className={`badge ${order.status === "DELIVERED" ? "badge-green" : "badge-ember"}`} style={{ fontSize: 10 }}>
                      {order.status}
                    </span>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{order.restaurantName}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    {formatCurrency(order.totalAmount)} · {order.deliveryAddress}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {ORDER_STATUSES.filter(s => s !== order.status).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(order.id, s)}
                      className="btn-ghost"
                      style={{ fontSize: 11, padding: "5px 12px" }}
                    >
                      → {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Restaurants */}
      {tab === "restaurants" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {restaurants.map(r => (
            <div key={r.id} className="card" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span className="badge badge-muted" style={{ fontSize: 10 }}>{r.cuisine}</span>
                <span className={`badge ${r.open ? "badge-green" : "badge-muted"}`} style={{ fontSize: 10 }}>
                  {r.open ? "Open" : "Closed"}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 18, color: "var(--text-primary)", marginBottom: 4 }}>
                {r.name}
              </h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>{r.city}</p>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text-secondary)" }}>
                <span>⭐ {r.rating}</span>
                <span>🕐 {r.deliveryTimeMinutes} min</span>
                <span>Min {formatCurrency(r.minOrderAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Add Restaurant */}
      {tab === "add" && (
        <div style={{ maxWidth: 700 }}>
          <div className="card" style={{ padding: "28px 32px" }}>
            <h2 className="display" style={{ fontSize: 26, marginBottom: 24 }}>New restaurant</h2>
            <form onSubmit={createRestaurant}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {[
                  ["Name", "name", "text", "Spice Garden"],
                  ["Cuisine", "cuisine", "text", "Indian"],
                  ["City", "city", "text", "Bhubaneswar"],
                  ["Address", "address", "text", "123 Main Street"],
                  ["Image URL", "imageUrl", "url", "https://..."],
                  ["Rating", "rating", "number", "4.5"],
                  ["Delivery (min)", "deliveryTimeMinutes", "number", "30"],
                  ["Delivery fee ₹", "deliveryFee", "number", "35"],
                  ["Min order ₹", "minOrderAmount", "number", "199"],
                ].map(([label, key, type, ph]) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      className="input"
                      placeholder={ph}
                      value={form[key]}
                      step={type === "number" ? "0.1" : undefined}
                      onChange={e => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Description
                </label>
                <textarea
                  className="input"
                  style={{ minHeight: 80, resize: "vertical" }}
                  placeholder="Authentic flavours from..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.open}
                  onChange={e => setForm({ ...form, open: e.target.checked })}
                  style={{ accentColor: "var(--ember)", width: 16, height: 16 }}
                />
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>Open for orders</span>
              </label>

              <button type="submit" className="btn-primary" style={{ padding: "12px 32px" }}>
                <Plus size={15} /> Create Restaurant
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}