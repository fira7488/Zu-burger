import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { formatCurrency } from "../../utils/currency";
import { useAdminOrders } from "../hooks/useAdminOrders";

const ORDER_STATUSES = [
  "Pending",
  "Awaiting Verification",
  "Accepted",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
];

export default function AdminOrders() {
  const { orders, loading, fetchError, updateStatus } = useAdminOrders();

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-red-800">
          Order management
        </p>
        <h1 className="mt-1 text-3xl font-black text-zinc-950">Orders</h1>
        <p className="mt-2 text-zinc-600">
          View incoming orders and update their status.
        </p>
      </div>

      {fetchError && (
        <p className="mb-4 rounded-lg bg-yellow-100 p-4 text-sm text-yellow-900">
          {fetchError}
        </p>
      )}

      {loading ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center text-zinc-600">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          body="Customer orders will appear here for staff review."
        />
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-black text-zinc-950">
                      {order.id}
                    </h3>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">
                    {new Date(
                      order.createdAt || order.submittedAt,
                    ).toLocaleString()}
                  </p>
                  <div className="mt-4 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
                    <p>
                      <span className="font-black">Customer:</span>{" "}
                      {order.customer.name}
                    </p>
                    <p>
                      <span className="font-black">Phone:</span>{" "}
                      {order.customer.phone}
                    </p>
                    <p className="sm:col-span-2">
                      <span className="font-black">Address:</span>{" "}
                      {order.customer.address}
                    </p>
                  </div>
                  <div className="mt-4 rounded-lg bg-zinc-50 p-4">
                    {order.items.map((item) => (
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
                    <p className="mt-3 text-sm">
                      <span className="font-black">Payment:</span>{" "}
                      {order.paymentMethod || "Cash"}
                    </p>
                  </div>
                </div>
                <div className="min-w-56">
                  <p className="mb-3 text-2xl font-black text-red-800">
                    {formatCurrency(order.total)}
                  </p>
                  <label className="block">
                    <span className="mb-2 block text-sm font-black">
                      Update status
                    </span>
                    <select
                      className="h-12 w-full rounded-lg border border-zinc-200 bg-white px-3 outline-none focus:border-red-800 focus:ring-4 focus:ring-yellow-200"
                      value={order.status}
                      onChange={(event) =>
                        updateStatus(order.id, event.target.value)
                      }
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
