import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";
import { showToast } from "../App";

const PAYMENT_METHODS = [
  { value: "COD", label: "Cash on Delivery", icon: "💵" },
  { value: "UPI", label: "UPI", icon: "📱" },
  { value: "CARD", label: "Credit / Debit Card", icon: "💳" },
];

export default function CartPage() {
  const { cart, updateItem, removeItem, clearCart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("KIIT Road, Bhubaneswar");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const isEmpty = !cart.items?.length;

  async function handleQty(item, next) {
    if (next < 1) { await removeItem(item.id); return; }
    await updateItem(item.id, next);
  }

  async function handleRemove(item) {
    await removeItem(item.id);
    showToast(`${item.name} removed`, "info");
  }

  async function handlePlace() {
    try {
      setPlacing(true); setError("");
      await api.post("/api/order/place", { deliveryAddress: address, paymentMethod });
      await refreshCart();
      showToast("Order placed! 🎉", "success");
      navigate("/orders");
    } catch (err) {
      const msg = err.response?.data?.message || "Could not place the order.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <main className="page-shell fade-up" style={{ paddingTop: 36 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span className="badge badge-muted" style={{ marginBottom: 12, display: "inline-flex" }}>
          <ShoppingBag size={11} /> Cart
        </span>
        <h1 className="display" style={{ fontSize: 40 }}>Your order</h1>
        {!isEmpty && (
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6 }}>
            {cart.items.length} item{cart.items.length > 1 ? "s" : ""} from {cart.restaurantName}
          </p>
        )}
      </div>

      {isEmpty ? (
        /* Empty state */
        <div className="card" style={{ padding: 72, textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
            Your cart is empty
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28 }}>
            Browse restaurants and add something delicious
          </p>
          <Link to="/" className="btn-primary">Browse Restaurants</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>

          {/* Left – items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {cart.items.map((item) => (
              <div key={item.id} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 10, flexShrink: 0,
                  background: "var(--bg-secondary)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                }}>
                  🍽
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)" }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{item.category}</p>
                </div>

                <div className="qty-stepper">
                  <button className="qty-btn" onClick={() => handleQty(item, item.quantity - 1)}>
                    {item.quantity === 1 ? <Trash2 size={14} style={{ color: "#dc2626" }} /> : <Minus size={14} />}
                  </button>
                  <span className="qty-val">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => handleQty(item, item.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>

                <p style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 700,
                  fontSize: 18, color: "var(--text-primary)", minWidth: 80, textAlign: "right",
                  letterSpacing: "-0.02em",
                }}>
                  {formatCurrency(item.lineTotal)}
                </p>

                <button
                  onClick={() => handleRemove(item)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", padding: 6, borderRadius: 8,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#dc2626"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            <button
              onClick={() => clearCart()}
              className="btn-ghost"
              style={{ alignSelf: "flex-start", color: "#dc2626", borderColor: "rgba(220,38,38,0.25)" }}
            >
              Clear cart
            </button>
          </div>

          {/* Right – summary + checkout */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 82 }}>
            {/* Summary */}
            <div className="card" style={{ padding: "22px 24px" }}>
              <p style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 18 }}>
                Order summary
              </p>
              {[
                ["Subtotal", formatCurrency(cart.subtotal)],
                ["Delivery fee", formatCurrency(cart.deliveryFee)],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
                  <span style={{ color: "var(--text-secondary)" }}>{l}</span>
                  <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--border)", marginTop: 10, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>Total</span>
                <span style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 900,
                  fontSize: 26, color: "var(--ember)", letterSpacing: "-0.04em",
                }}>
                  {formatCurrency(cart.total)}
                </span>
              </div>
            </div>

            {/* Checkout form */}
            <div className="card" style={{ padding: "22px 24px" }}>
              <p style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 16 }}>
                Delivery details
              </p>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
                  Delivery address
                </label>
                <textarea
                  className="input"
                  style={{ minHeight: 80, resize: "vertical" }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>
                  Payment method
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {PAYMENT_METHODS.map(pm => (
                    <label key={pm.value} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 14px", borderRadius: 10,
                      border: paymentMethod === pm.value ? "1.5px solid var(--ember)" : "1px solid var(--border)",
                      background: paymentMethod === pm.value ? "var(--ember-dim)" : "var(--bg-secondary)",
                      cursor: "pointer", transition: "all 0.15s",
                    }}>
                      <input
                        type="radio" name="pm" value={pm.value}
                        checked={paymentMethod === pm.value}
                        onChange={() => setPaymentMethod(pm.value)}
                        style={{ accentColor: "var(--ember)" }}
                      />
                      <span style={{ fontSize: 16 }}>{pm.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{pm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{
                  padding: "10px 14px", background: "rgba(220,38,38,0.08)",
                  border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10,
                  color: "#dc2626", fontSize: 13, marginBottom: 14,
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={handlePlace}
                disabled={placing || isEmpty}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "13px" }}
              >
                {placing ? "Placing order..." : (
                  <>Place Order <ArrowRight size={15} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}