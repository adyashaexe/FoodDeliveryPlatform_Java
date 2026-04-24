import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client";
import RestaurantCard from "../components/RestaurantCard";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  async function fetchRestaurants(searchTerm = "") {
    try {
      setLoading(true);
      const params = searchTerm ? { q: searchTerm } : {};
      const { data } = await api.get("/api/restaurants", { params });
      setRestaurants(data);
      setError("");
    } catch {
      setError("Unable to load restaurants right now.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    fetchRestaurants(query);
  }

  return (
    <main className="page-shell space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="paper-card p-8 lg:p-12">
          <p className="pill inline-block bg-turmeric/30 text-berry">Freshly built full stack</p>
          <h1 className="mt-5 font-display text-5xl font-bold leading-tight text-ink">
            Browse restaurants, assemble a cart, and place tracked orders.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
            The home page pulls from your Spring Boot REST API and gives the repo a much more “real product” feel.
          </p>
        </div>

        <div className="paper-card flex flex-col justify-between p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-stone-400">Search</p>
            <p className="mt-3 text-2xl font-semibold text-ink">Filter by cuisine or restaurant name</p>
          </div>
          <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleSearch}>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                className="soft-input pl-11"
                placeholder="Try Indian, Pizza, Spice Route..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button type="submit" className="primary-button">
              Search
            </button>
          </form>
        </div>
      </section>

      {error && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm text-berry">{error}</p>}

      {loading ? (
        <div className="paper-card p-8 text-sm text-stone-500">Loading restaurants...</div>
      ) : (
        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </section>
      )}
    </main>
  );
}
