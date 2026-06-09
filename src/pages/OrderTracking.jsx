import { Search } from "lucide-react";
import { useState } from "react";
import Button from "../components/Button";
import SectionHeader from "../components/SectionHeader";
import StatusBadge from "../components/StatusBadge";
import { formatCurrency } from "../utils/currency";
import { getStoredOrders } from "../utils/orders";

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (event) => {
    event.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    const trimmed = orderId.trim();
    if (!trimmed) {
      setError("Please enter your order number.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/orders/${trimmed}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        setLoading(false);
        return;
      }
    } catch {
      // fall through to local storage
    }

    const local = getStoredOrders().find((item) => item.id === trimmed);
    if (local) {
      setOrder(local);
    } else {
      setError("Order not found. Check your order number and try again.");
    }
    setLoading(false);
  };

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <SectionHeader
          eyebrow="Order tracking"
          title="Track your order"
          body="Enter your order number to see the latest status of your meal."
        />

        <form
          onSubmit={handleTrack}
          className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-black text-zinc-700">
              Order number
            </span>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder="e.g. ZU-20260609-1234"
                className="h-12 w-full rounded-lg border border-zinc-200 pl-10 pr-4 outline-none focus:border-red-800 focus:ring-4 focus:ring-yellow-200"
              />
            </div>
          </label>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-800">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 h-12 w-full rounded-lg bg-red-800 font-black text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Looking up order..." : "Track order"}
          </button>
        </form>

        {order && (
          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-black text-zinc-950">{order.id}</h2>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-2 text-sm text-zinc-500">
              Placed{" "}
              {new Date(order.submittedAt || order.createdAt).toLocaleString()}
            </p>

            <div className="mt-5 rounded-lg bg-zinc-50 p-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-3 py-1 text-sm"
                >
                  <span>
                    {item.quantity} x {item.name}
                  </span>
                  <span className="font-bold">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <p className="mt-3 border-t border-zinc-200 pt-3 text-right font-black text-red-800">
                Total: {formatCurrency(order.total)}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button to="/menu" variant="outline">
                Order again
              </Button>
              <Button to="/">Back to home</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
