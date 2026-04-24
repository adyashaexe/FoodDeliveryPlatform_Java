import { useEffect, useState } from "react";
import api from "../api/client";

const initialRestaurant = {
  name: "",
  cuisine: "",
  city: "",
  address: "",
  description: "",
  imageUrl: "",
  rating: 4.5,
  deliveryTimeMinutes: 30,
  deliveryFee: 35,
  minOrderAmount: 199,
  open: true,
};

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantForm, setRestaurantForm] = useState(initialRestaurant);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [ordersResponse, restaurantsResponse] = await Promise.all([
        api.get("/api/admin/orders"),
        api.get("/api/restaurants"),
      ]);
      setOrders(ordersResponse.data);
      setRestaurants(restaurantsResponse.data);
    } catch {
      setError("Unable to load admin data.");
    }
  }

  async function createRestaurant(event) {
    event.preventDefault();
    try {
      await api.post("/api/admin/restaurants", restaurantForm);
      setRestaurantForm(initialRestaurant);
      setMessage("Restaurant created successfully.");
      setError("");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create restaurant.");
    }
  }

  async function updateOrderStatus(orderId, status) {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status });
      setMessage(`Order ${orderId} moved to ${status}.`);
      setError("");
      loadData();
    } catch {
      setError("Could not update order status.");
    }
  }

  return (
    <main className="page-shell space-y-8">
      <section className="paper-card p-8">
        <p className="pill inline-block bg-ink text-white">Admin dashboard</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-ink">Operate the marketplace side of the app</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
          This is the project’s advanced feature: an admin view for creating restaurants and managing order flow.
        </p>
      </section>

      {message && <p className="rounded-2xl bg-basil/10 px-4 py-3 text-sm text-basil">{message}</p>}
      {error && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm text-berry">{error}</p>}

      <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <form className="paper-card p-6" onSubmit={createRestaurant}>
          <h2 className="font-display text-3xl font-bold text-ink">Add restaurant</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={restaurantForm.name} onChange={(value) => setRestaurantForm({ ...restaurantForm, name: value })} />
            <Field label="Cuisine" value={restaurantForm.cuisine} onChange={(value) => setRestaurantForm({ ...restaurantForm, cuisine: value })} />
            <Field label="City" value={restaurantForm.city} onChange={(value) => setRestaurantForm({ ...restaurantForm, city: value })} />
            <Field label="Address" value={restaurantForm.address} onChange={(value) => setRestaurantForm({ ...restaurantForm, address: value })} />
            <Field label="Image URL" value={restaurantForm.imageUrl} onChange={(value) => setRestaurantForm({ ...restaurantForm, imageUrl: value })} />
            <Field label="Rating" type="number" value={restaurantForm.rating} onChange={(value) => setRestaurantForm({ ...restaurantForm, rating: Number(value) })} />
            <Field label="Delivery Minutes" type="number" value={restaurantForm.deliveryTimeMinutes} onChange={(value) => setRestaurantForm({ ...restaurantForm, deliveryTimeMinutes: Number(value) })} />
            <Field label="Delivery Fee" type="number" value={restaurantForm.deliveryFee} onChange={(value) => setRestaurantForm({ ...restaurantForm, deliveryFee: Number(value) })} />
            <Field label="Minimum Order" type="number" value={restaurantForm.minOrderAmount} onChange={(value) => setRestaurantForm({ ...restaurantForm, minOrderAmount: Number(value) })} />
            <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={restaurantForm.open}
                onChange={(event) => setRestaurantForm({ ...restaurantForm, open: event.target.checked })}
              />
              Open for orders
            </label>
          </div>
          <textarea
            className="soft-input mt-4 min-h-28"
            placeholder="Description"
            value={restaurantForm.description}
            onChange={(event) => setRestaurantForm({ ...restaurantForm, description: event.target.value })}
          />
          <button type="submit" className="primary-button mt-5">
            Create Restaurant
          </button>
        </form>

        <div className="space-y-6">
          <div className="paper-card p-6">
            <h2 className="font-display text-3xl font-bold text-ink">Live restaurants</h2>
            <div className="mt-4 space-y-3">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="rounded-2xl bg-stone-50 px-4 py-3">
                  <p className="font-semibold text-ink">{restaurant.name}</p>
                  <p className="text-sm text-stone-500">
                    {restaurant.cuisine} • {restaurant.city} • {restaurant.open ? "Open" : "Closed"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="paper-card p-6">
            <h2 className="font-display text-3xl font-bold text-ink">Manage orders</h2>
            <div className="mt-4 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-[24px] border border-stone-200 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-semibold text-ink">{order.restaurantName}</p>
                      <p className="text-sm text-stone-500">
                        #{order.id} • {order.trackingCode} • {order.status}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"].map((status) => (
                        <button
                          key={status}
                          type="button"
                          className="secondary-button !px-3 !py-2"
                          onClick={() => updateOrderStatus(order.id, status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-stone-600">{label}</span>
      <input className="soft-input" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
