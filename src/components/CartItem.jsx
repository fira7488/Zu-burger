import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";

export default function CartItem({ item }) {
  const { increase, decrease, removeItem } = useCart();

  return (
    <article className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-[96px_1fr_auto] sm:items-center">
      <img className="h-24 w-full rounded-md object-cover sm:w-24" src={item.image} alt={item.name} />
      <div>
        <h3 className="font-black text-zinc-950">{item.name}</h3>
        <p className="mt-1 text-sm font-bold text-red-800">{formatCurrency(item.price)}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full border border-zinc-200">
          <button className="grid size-10 place-items-center" onClick={() => decrease(item.id)} aria-label={`Decrease ${item.name}`}>
            <Minus size={16} />
          </button>
          <span className="w-9 text-center font-black">{item.quantity}</span>
          <button className="grid size-10 place-items-center" onClick={() => increase(item.id)} aria-label={`Increase ${item.name}`}>
            <Plus size={16} />
          </button>
        </div>
        <button
          className="grid size-10 place-items-center rounded-full bg-red-50 text-red-800 transition hover:bg-red-800 hover:text-white"
          onClick={() => removeItem(item.id)}
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}
