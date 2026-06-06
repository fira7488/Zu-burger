import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";
import Button from "./Button";

export default function OrderSummary({ cta = true }) {
  const { items, subtotal, total } = useCart();

  return (
    <aside className="rounded-lg border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-950/5">
      <h2 className="text-xl font-black">Order Summary</h2>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between gap-4 text-sm">
            <span className="text-zinc-600">
              {item.quantity} x {item.name}
            </span>
            <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="my-5 border-t border-zinc-200" />
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-zinc-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-lg font-black">
          <span>Total</span>
          <span className="text-red-800">{formatCurrency(total)}</span>
        </div>
      </div>
      {cta && items.length > 0 && (
        <Button to="/checkout" className="mt-6 w-full">
          Proceed to Checkout
        </Button>
      )}
    </aside>
  );
}
