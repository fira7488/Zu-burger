import { useMemo } from "react";
import StatusBadge from "../../components/StatusBadge";
import { formatCurrency } from "../../utils/currency";
import { useAdminOrders } from "../hooks/useAdminOrders";

export default function AdminPayments() {
  const { orders, loading } = useAdminOrders();

  const payments = useMemo(
    () =>
      orders.map((order) => ({
        id: order.id,
        customer: order.customer?.name,
        method: order.paymentMethod || "Cash on delivery",
        amount: order.total,
        status: order.status,
        reference: order.transactionRef || "—",
        date: order.submittedAt || order.createdAt,
      })),
    [orders],
  );

  const verified = payments.filter((p) =>
    ["Accepted", "Preparing", "Ready", "Completed"].includes(p.status),
  ).length;

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-red-800">
          Payment management
        </p>
        <h1 className="mt-1 text-3xl font-black text-zinc-950">Payments</h1>
        <p className="mt-2 text-zinc-600">
          Review transactions and payment verification status.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-zinc-950 p-5 text-white">
          <p className="text-sm font-bold text-zinc-400">Total transactions</p>
          <p className="mt-2 text-3xl font-black">{payments.length}</p>
        </div>
        <div className="rounded-xl bg-green-700 p-5 text-white">
          <p className="text-sm font-bold text-green-100">Verified</p>
          <p className="mt-2 text-3xl font-black">{verified}</p>
        </div>
        <div className="rounded-xl bg-yellow-400 p-5 text-zinc-950">
          <p className="text-sm font-bold">Pending verification</p>
          <p className="mt-2 text-3xl font-black">
            {payments.length - verified}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">
          No payment records yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-black">Order</th>
                <th className="px-4 py-3 font-black">Customer</th>
                <th className="px-4 py-3 font-black">Method</th>
                <th className="px-4 py-3 font-black">Reference</th>
                <th className="px-4 py-3 font-black">Amount</th>
                <th className="px-4 py-3 font-black">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-4 py-3 font-bold">{payment.id}</td>
                  <td className="px-4 py-3">{payment.customer}</td>
                  <td className="px-4 py-3">{payment.method}</td>
                  <td className="px-4 py-3 font-mono text-xs">{payment.reference}</td>
                  <td className="px-4 py-3 font-black text-red-800">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={payment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
