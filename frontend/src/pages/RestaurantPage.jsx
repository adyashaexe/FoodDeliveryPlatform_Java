import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock3, MapPin, ShoppingBag } from "lucide-react";
import api from "../api/client";
import MenuItemCard from "../components/MenuItemCard";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";

export default function RestaurantPage() {
  const { restaurantId } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  async function fetchRestaurant() {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/restaurants/${restaurantId}`);
      setDetails(data);
      setError("");
    } catch {
      setError("Could not load restaurant details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(menuItemId) {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(menuItemId, 1);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add item to cart.");
    }
  }

  if (loading) {
    return <main className="page-shell"><div className="paper-card p-8 text-sm text-stone-500">Loading menu...</div></main>;
  }

  if (!details) {
    return <main className="page-shell"><div className="paper-card p-8 text-sm text-berry">{error}</div></main>;
  }

  const { restaurant, menu } = details;

  return (
    <main className="page-shell space-y-8">
      <section className="paper-card overflow-hidden">
        <div
          className="h-64 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(17,24,39,0.55), rgba(249,115,96,0.15)), url(${restaurant.imageUrl})`,
          }}
        />
        <div className="grid gap-6 p-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="pill inline-block bg-coral/10 text-coral">{restaurant.cuisine}</p>
            <h1 className="mt-4 font-display text-5xl font-bold text-ink">{restaurant.name}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-600">{restaurant.description}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-stone-600">
              <Badge icon={<MapPin size={16} />} text={`${restaurant.address}, ${restaurant.city}`} />
              <Badge icon={<Clock3 size={16} />} text={`${restaurant.deliveryTimeMinutes} min delivery`} />
              <Badge icon={<ShoppingBag size={16} />} text={`Cart items: ${cart.items?.length || 0}`} />
            </div>
          </div>
          <div className="paper-card p-5">
            <p className="text-sm text-stone-500">Minimum order</p>
            <p className="font-display text-4xl font-bold text-coral">{formatCurrency(restaurant.minOrderAmount)}</p>
            <p className="mt-2 text-sm text-stone-500">Delivery fee {formatCurrency(restaurant.deliveryFee)}</p>
          </div>
        </div>
      </section>

      {error && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm text-berry">{error}</p>}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold text-ink">Menu</h2>
          <button type="button" className="secondary-button" onClick={() => navigate("/cart")}>
            View Cart
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {menu.map((item) => (
            <MenuItemCard key={item.id} item={item} onAdd={handleAdd} disabled={!restaurant.open} />
          ))}
        </div>
      </section>
    </main>
  );
}

function Badge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2">
      <span className="text-coral">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
