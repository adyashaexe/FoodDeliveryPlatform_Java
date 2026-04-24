import { Leaf, Plus, Sparkles } from "lucide-react";
import { formatCurrency } from "../utils/currency";

export default function MenuItemCard({ item, onAdd, disabled }) {
  return (
    <div className="rounded-[24px] border border-stone-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-ink">{item.name}</h3>
            {item.veg && (
              <span className="pill bg-basil/10 text-basil">
                <Leaf size={12} />
                Veg
              </span>
            )}
            {item.bestseller && (
              <span className="pill bg-turmeric/20 text-berry">
                <Sparkles size={12} />
                Bestseller
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
        </div>
        <p className="font-semibold text-coral">{formatCurrency(item.price)}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
          {item.category}
        </span>
        <button
          type="button"
          className="primary-button gap-2 !px-4 !py-2"
          onClick={() => onAdd(item.id)}
          disabled={disabled || !item.available}
        >
          <Plus size={16} />
          {item.available ? "Add" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}
