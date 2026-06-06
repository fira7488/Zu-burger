import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import SectionHeader from "../components/SectionHeader";
import StatusBadge from "../components/StatusBadge";
import { formatCurrency } from "../utils/currency";
import { getStoredOrders, updateStoredOrderStatus } from "../utils/orders";
import { useTranslation } from "../i18n";

const statuses = [
  "Awaiting Verification",
  "Accepted",
  "Preparing",
  "Ready",
  "Completed",
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      try {
        const response = await fetch("/api/orders", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Failed to load server orders.");
        }
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        setFetchError(
          "Unable to load orders from the backend. Showing saved local orders.",
        );
        setOrders(getStoredOrders());
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
    return () => controller.abort();
  }, []);

  const revenue = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders],
  );

  const updateStatus = async (orderId, status) => {
    const nextOrders = updateStoredOrderStatus(orderId, status);
    setOrders(nextOrders);

    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      setFetchError("Could not update order status on the server.");
    }
  };

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={t("admin.eyebrow")}
          title={t("admin.title")}
          body={t("admin.body")}
        />

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-red-800 p-5 text-white">
            <p className="text-sm font-bold text-red-100">
              {t("admin.totalOrders")}
            </p>
            <p className="mt-2 text-3xl font-black">{orders.length}</p>
          </div>
          <div className="rounded-lg bg-orange-500 p-5 text-white">
            <p className="text-sm font-bold text-orange-50">
              {t("admin.demoRevenue")}
            </p>
            <p className="mt-2 text-3xl font-black">
              {formatCurrency(revenue)}
            </p>
          </div>
          <div className="rounded-lg bg-zinc-950 p-5 text-white">
            <p className="text-sm font-bold text-zinc-300">
              {t("admin.activeOrders")}
            </p>
            <p className="mt-2 text-3xl font-black">
              {orders.filter((order) => order.status !== "Completed").length}
            </p>
          </div>
        </div>

        {fetchError && (
          <p className="mb-4 rounded-lg bg-yellow-100 p-4 text-sm text-yellow-900">
            {fetchError}
          </p>
        )}

        {loading ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-10 text-center text-zinc-600">
            Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            body="Placed checkout orders will appear here for staff review."
            action="Create Demo Order"
            to="/menu"
          />
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
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
                      <div className="mt-3 text-sm">
                        <p>
                          <span className="font-black">Payment:</span>{" "}
                          {order.paymentMethod || "Cash"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-56">
                    <p className="mb-3 text-right text-2xl font-black text-red-800 lg:text-left">
                      {formatCurrency(order.total)}
                    </p>
                    <label className="block">
                      <span className="mb-2 block text-sm font-black">
                        Order Status
                      </span>
                      <select
                        className="h-12 w-full rounded-lg border border-zinc-200 bg-white px-3 outline-none focus:border-red-800 focus:ring-4 focus:ring-yellow-200"
                        value={order.status}
                        onChange={(event) =>
                          updateStatus(order.id, event.target.value)
                        }
                      >
                        {statuses.map((status) => (
                          <option key={status}>{status}</option>
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
    </section>
  );
}
