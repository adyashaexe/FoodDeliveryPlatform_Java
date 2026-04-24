import { useEffect, useState } from "react";
import api from "../api/client";
import OrderCard from "../components/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const { data } = await api.get("/api/order/my");
      setOrders(data);
      setError("");
    } catch {
      setError("Could not load your orders.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell space-y-6">
      <section className="paper-card p-8">
        <p className="pill inline-block bg-coral/10 text-coral">Orders</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-ink">Track every order from one screen</h1>
        <p className="mt-3 text-sm leading-7 text-stone-600">
          This page uses the protected order APIs and gives your repo a much stronger product story.
        </p>
      </section>

      {error && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm text-berry">{error}</p>}

      {loading ? (
        <div className="paper-card p-8 text-sm text-stone-500">Loading your orders...</div>
      ) : orders.length ? (
        <section className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </section>
      ) : (
        <div className="paper-card p-8 text-sm text-stone-500">No orders yet. Place your first one from the cart.</div>
      )}
    </main>
  );
}
