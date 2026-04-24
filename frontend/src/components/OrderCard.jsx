import { Clock3, MapPin, Truck } from "lucide-react";
import { formatCurrency } from "../utils/currency";

export default function OrderCard({ order }) {
  return (
    <article className="paper-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill bg-ink text-white">{order.status}</span>
            <span className="pill bg-basil/10 text-basil">{order.paymentStatus}</span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-bold text-ink">{order.restaurantName}</h3>
          <p className="mt-1 text-sm text-stone-500">Tracking: {order.trackingCode}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-stone-500">Total</p>
          <p className="font-display text-3xl font-bold text-coral">{formatCurrency(order.totalAmount)}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-stone-600 sm:grid-cols-3">
        <Meta icon={<MapPin size={16} />} text={order.deliveryAddress} />
        <Meta icon={<Clock3 size={16} />} text={new Date(order.estimatedDeliveryAt).toLocaleString()} />
        <Meta icon={<Truck size={16} />} text={order.paymentMethod} />
      </div>

      <div className="mt-5 space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
            <div>
              <p className="font-medium text-ink">{item.name}</p>
              <p className="text-xs text-stone-500">Qty {item.quantity}</p>
            </div>
            <p className="font-semibold text-ink">{formatCurrency(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function Meta({ icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-stone-50 px-4 py-3">
      <span className="text-coral">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
