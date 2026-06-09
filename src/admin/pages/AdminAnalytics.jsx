import { useMemo } from "react";
import { formatCurrency } from "../../utils/currency";
import { useAdminOrders } from "../hooks/useAdminOrders";

export default function AdminAnalytics() {
  const { orders, loading } = useAdminOrders();

  const analytics = useMemo(() => {
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    const completed = orders.filter((o) => o.status === "Completed").length;
    const cancelled = orders.filter((o) => o.status === "Cancelled").length;
    const avgOrder = orders.length ? revenue / orders.length : 0;

    const productCounts = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        productCounts[item.name] =
          (productCounts[item.name] || 0) + item.quantity;
      });
    });

    const popular = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { revenue, completed, cancelled, avgOrder, popular, total: orders.length };
  }, [orders]);

  if (loading) {
    return <p className="text-zinc-500">Loading analytics...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-red-800">
          Business insights
        </p>
        <h1 className="mt-1 text-3xl font-black text-zinc-950">Analytics</h1>
        <p className="mt-2 text-zinc-600">
          Revenue overview, order statistics, and popular products.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total revenue" value={formatCurrency(analytics.revenue)} />
        <Metric label="Total orders" value={analytics.total} />
        <Metric label="Completed" value={analytics.completed} />
        <Metric label="Avg. order value" value={formatCurrency(analytics.avgOrder)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-zinc-950">Order breakdown</h2>
          <dl className="mt-4 space-y-3">
            <Row label="Completed orders" value={analytics.completed} />
            <Row label="Cancelled orders" value={analytics.cancelled} />
            <Row
              label="In progress"
              value={analytics.total - analytics.completed - analytics.cancelled}
            />
          </dl>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-zinc-950">Popular products</h2>
          {analytics.popular.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">No sales data yet.</p>
          ) : (
            <ol className="mt-4 space-y-3">
              {analytics.popular.map(([name, qty], index) => (
                <li
                  key={name}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    <span className="mr-2 font-black text-red-800">
                      #{index + 1}
                    </span>
                    {name}
                  </span>
                  <span className="font-bold">{qty} sold</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-zinc-950">{value}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <dt className="text-zinc-600">{label}</dt>
      <dd className="font-black text-zinc-950">{value}</dd>
    </div>
  );
}
