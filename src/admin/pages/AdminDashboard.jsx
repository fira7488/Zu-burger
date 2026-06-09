import { useMemo } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/currency";
import { useAdminOrders } from "../hooks/useAdminOrders";

export default function AdminDashboard() {
  const { orders, loading } = useAdminOrders();

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const active = orders.filter(
      (order) => !["Completed", "Cancelled"].includes(order.status),
    ).length;
    const pending = orders.filter((order) =>
      ["Pending", "Awaiting Verification", "Payment Submitted — Verifying"].includes(
        order.status,
      ),
    ).length;
    return { revenue, active, pending, total: orders.length };
  }, [orders]);

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-red-800">
          Overview
        </p>
        <h1 className="mt-1 text-3xl font-black text-zinc-950">Dashboard</h1>
        <p className="mt-2 text-zinc-600">
          Monitor today&apos;s operations at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={stats.total} tone="red" />
        <StatCard
          label="Revenue"
          value={formatCurrency(stats.revenue)}
          tone="orange"
        />
        <StatCard label="Active orders" value={stats.active} tone="dark" />
        <StatCard label="Pending review" value={stats.pending} tone="yellow" />
      </div>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-zinc-950">Recent orders</h2>
          <Link
            to="/admin/orders"
            className="text-sm font-bold text-red-800 hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <p className="text-zinc-500">Loading orders...</p>
        ) : recentOrders.length === 0 ? (
          <p className="text-zinc-500">No orders yet.</p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-black text-zinc-950">{order.id}</p>
                  <p className="text-sm text-zinc-500">
                    {order.customer?.name} · {order.status}
                  </p>
                </div>
                <p className="font-black text-red-800">
                  {formatCurrency(order.total)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  const tones = {
    red: "bg-red-800 text-white",
    orange: "bg-orange-500 text-white",
    dark: "bg-zinc-950 text-white",
    yellow: "bg-yellow-400 text-zinc-950",
  };

  return (
    <div className={`rounded-xl p-5 ${tones[tone]}`}>
      <p className="text-sm font-bold opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
