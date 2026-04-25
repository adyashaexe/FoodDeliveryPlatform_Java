import { useEffect, useState } from "react";
import api from "../api/client";
import { ClipboardList, MapPin, Clock, CreditCard, Package, ChefHat, Bike, CheckCircle } from "lucide-react";
import { formatCurrency } from "../utils/currency";

const STATUS_STEPS = [
  { key: "CONFIRMED", label: "Confirmed", icon: <Package size={14} /> },
  { key: "PREPARING", label: "Preparing", icon: <ChefHat size={14} /> },
  { key: "OUT_FOR_DELIVERY", label: "On the way", icon: <Bike size={14} /> },
  { key: "DELIVERED", label: "Delivered", icon: <CheckCircle size={14} /> },
];

function getStepIndex(status) {
  const idx = STATUS_STEPS.findIndex(s => s.key === status);
  return idx === -1 ? 0 : idx;
}

function OrderCard({ order }) {
  const stepIdx = getStepIndex(order.status);
  const progress = ((stepIdx + 1) / STATUS_STEPS.length) * 100;
  const isDelivered = order.status === "DELIVERED";

  return (
    <article className="card fade-up" style={{ padding: "24px 28px", overflow: "hidden" }}>
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace", letterSpacing: "0.1em" }}>
              #{order.id}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--border)" }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>
              {order.trackingCode}
            </span>
          </div>
          <h3 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 700,
            fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.03em",
          }}>
            {order.restaurantName}
          </h3>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className={`badge ${isDelivered ? "badge-green" : "badge-ember"}`}
            style={{ marginBottom: 6, display: "inline-flex" }}>
            {isDelivered ? <CheckCircle size={10} /> : <Bike size={10} />}
            {order.status?.replace("_", " ")}
          </span>
          <p style={{
            fontFamily: "'Fraunces', serif", fontWeight: 900,
            fontSize: 28, color: "var(--ember)", letterSpacing: "-0.04em", lineHeight: 1,
          }}>
            {formatCurrency(order.totalAmount)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 20 }}>
        <div className="progress-track" style={{ marginBottom: 12 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {STATUS_STEPS.map((step, i) => (
            <div key={step.key} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: i <= stepIdx ? "var(--ember)" : "var(--bg-secondary)",
                border: `2px solid ${i <= stepIdx ? "var(--ember)" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: i <= stepIdx ? "white" : "var(--text-muted)",
                transition: "all 0.3s",
              }}>
                {step.icon}
              </div>
              <span style={{
                fontSize: 10.5, textAlign: "center", lineHeight: 1.3,
                color: i <= stepIdx ? "var(--ember)" : "var(--text-muted)",
                fontWeight: i === stepIdx ? 600 : 400,
                maxWidth: 60,
              }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        {[
          { icon: <MapPin size={13} />, text: order.deliveryAddress },
          { icon: <Clock size={13} />, text: order.estimatedDeliveryAt ? new Date(order.estimatedDeliveryAt).toLocaleString() : "–" },
          { icon: <CreditCard size={13} />, text: order.paymentMethod },
        ].map(({ icon, text }, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12.5,
            color: "var(--text-muted)", padding: "6px 12px",
            background: "var(--bg-secondary)", borderRadius: 8,
          }}>
            <span style={{ color: "var(--text-muted)" }}>{icon}</span>
            {text}
          </div>
        ))}
      </div>

      {/* Items */}
      <div style={{
        borderTop: "1px solid var(--border)", paddingTop: 16,
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        {order.items?.map((item) => (
          <div key={item.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 12px", borderRadius: 10, background: "var(--bg-secondary)",
          }}>
            <div>
              <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-primary)" }}>{item.name}</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 8 }}>× {item.quantity}</span>
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const { data } = await api.get("/api/order/my");
      setOrders(data);
    } catch {
      setError("Could not load your orders.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell" style={{ paddingTop: 36 }}>
      <div style={{ marginBottom: 32 }}>
        <span className="badge badge-muted" style={{ marginBottom: 12, display: "inline-flex" }}>
          <ClipboardList size={11} /> Orders
        </span>
        <h1 className="display" style={{ fontSize: 40 }}>Your orders</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6 }}>
          Track every order from placed to delivered.
        </p>
      </div>

      {error && (
        <div style={{ padding: "14px 18px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 12, color: "#dc2626", fontSize: 14, marginBottom: 24 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[1, 2].map(i => (
            <div key={i} className="card" style={{ padding: 28 }}>
              <div className="skeleton" style={{ height: 16, width: "40%", marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 28, width: "55%", marginBottom: 20 }} />
              <div className="skeleton" style={{ height: 6, marginBottom: 20 }} />
              <div className="skeleton" style={{ height: 60 }} />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ padding: 72, textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>No orders yet</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Your order history will appear here</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {orders.map((order, i) => (
            <div key={order.id} style={{ animationDelay: `${i * 0.08}s` }}>
              <OrderCard order={order} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}