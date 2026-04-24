import { Link } from "react-router-dom";
import { Clock3, IndianRupee, Star } from "lucide-react";
import { formatCurrency } from "../utils/currency";

export default function RestaurantCard({ restaurant }) {
  return (
    <article className="paper-card overflow-hidden">
      <div
        className="h-44 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(38,38,38,0.1), rgba(249,115,96,0.25)), url(${restaurant.imageUrl})`,
        }}
      />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="pill inline-block bg-coral/10 text-coral">{restaurant.cuisine}</p>
            <h3 className="mt-3 font-display text-2xl font-bold text-ink">{restaurant.name}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">{restaurant.description}</p>
          </div>
          <div className="rounded-2xl bg-basil px-3 py-2 text-sm font-semibold text-white">
            {restaurant.open ? "Open" : "Closed"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-stone-600 sm:grid-cols-4">
          <Meta icon={<Star size={16} className="text-turmeric" />} label={restaurant.rating} />
          <Meta icon={<Clock3 size={16} className="text-basil" />} label={`${restaurant.deliveryTimeMinutes} min`} />
          <Meta icon={<IndianRupee size={16} className="text-coral" />} label={formatCurrency(restaurant.deliveryFee)} />
          <Meta icon={<IndianRupee size={16} className="text-berry" />} label={`Min ${formatCurrency(restaurant.minOrderAmount)}`} />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-500">{restaurant.city}</p>
          <Link to={`/restaurants/${restaurant.id}`} className="primary-button">
            View Menu
          </Link>
        </div>
      </div>
    </article>
  );
}

function Meta({ icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-stone-50 px-3 py-3">
      {icon}
      <span>{label}</span>
    </div>
  );
}
