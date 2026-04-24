import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";

export default function CartPage() {
  const { cart, updateItem, removeItem, clearCart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("KIIT Road, Bhubaneswar");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  async function handleQuantity(item, nextQuantity) {
    if (nextQuantity < 1) {
      await removeItem(item.id);
      return;
    }
    await updateItem(item.id, nextQuantity);
  }

  async function handlePlaceOrder() {
    try {
      setPlacing(true);
      setError("");
      await api.post("/api/order/place", {
        deliveryAddress: address,
        paymentMethod,
      });
      await refreshCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Could not place the order.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <main className="page-shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-5">
        <div className="paper-card p-8">
          <p className="pill inline-block bg-basil/10 text-basil">Cart</p>
          <h1 className="mt-4 font-display text-4xl font-bold text-ink">Your order staging area</h1>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Review items, adjust quantities, and place an order through the backend API.
          </p>
        </div>

        <div className="paper-card p-6">
          {cart.items?.length ? (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-stone-200 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-ink">{item.name}</p>
                      <p className="text-sm text-stone-500">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-stone-200 bg-stone-50">
                        <button type="button" className="px-3 py-2" onClick={() => handleQuantity(item, item.quantity - 1)}>
                          <Minus size={16} />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button type="button" className="px-3 py-2" onClick={() => handleQuantity(item, item.quantity + 1)}>
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="w-24 text-right font-semibold text-ink">{formatCurrency(item.lineTotal)}</p>
                      <button type="button" className="rounded-full bg-berry/10 p-3 text-berry" onClick={() => removeItem(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" className="secondary-button" onClick={() => clearCart()}>
                Clear Cart
              </button>
            </div>
          ) : (
            <p className="text-sm text-stone-500">Your cart is empty. Add something delicious first.</p>
          )}
        </div>
      </section>

      <aside className="space-y-5">
        <div className="paper-card p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-stone-400">Order summary</p>
          <div className="mt-6 space-y-3 text-sm text-stone-600">
            <SummaryRow label="Restaurant" value={cart.restaurantName || "Not selected"} />
            <SummaryRow label="Subtotal" value={formatCurrency(cart.subtotal)} />
            <SummaryRow label="Delivery" value={formatCurrency(cart.deliveryFee)} />
            <SummaryRow label="Total" value={formatCurrency(cart.total)} strong />
          </div>
        </div>

        <div className="paper-card p-6">
          <h2 className="font-semibold text-ink">Checkout</h2>
          <div className="mt-4 space-y-4">
            <textarea
              className="soft-input min-h-28"
              placeholder="Delivery address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
            <select
              className="soft-input"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
            </select>
            {error && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm text-berry">{error}</p>}
            <button
              type="button"
              className="primary-button w-full"
              disabled={placing || !cart.items?.length}
              onClick={handlePlaceOrder}
            >
              {placing ? "Placing order..." : "Place Order"}
            </button>
          </div>
        </div>
      </aside>
    </main>
  );
}

function SummaryRow({ label, value, strong = false }) {
  return (
    <div className={`flex items-center justify-between ${strong ? "pt-3 text-base font-semibold text-ink" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
