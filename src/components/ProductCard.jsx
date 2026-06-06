import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";
import Button from "./Button";

export default function ProductCard({ item }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleAdd = () => {
    addItem(item);
    setAdded(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setAdded(false), 900);
  };

  return (
    <article className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-950/10">
      <div className="aspect-[4/3] overflow-hidden bg-zinc-200">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-zinc-950">
            {item.category}
          </span>
          <span className="text-lg font-black text-zinc-950">
            {formatCurrency(item.price)}
          </span>
        </div>
        <h3 className="text-xl font-black text-zinc-950">{item.name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-600">
          {item.description}
        </p>
        <Button
          className="mt-5 w-full"
          variant={added ? "secondary" : "primary"}
          onClick={handleAdd}
        >
          <Plus size={18} />
          {added ? "ordered" : "order now"}
        </Button>
      </div>
    </article>
  );
}
