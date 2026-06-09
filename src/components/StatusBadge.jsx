const tones = {
  Pending: "bg-yellow-100 text-yellow-900",
  "Awaiting Verification": "bg-yellow-100 text-yellow-900",
  "Payment Submitted — Verifying": "bg-amber-100 text-amber-900",
  "Awaiting Delivery": "bg-blue-100 text-blue-900",
  Accepted: "bg-blue-100 text-blue-900",
  Preparing: "bg-orange-100 text-orange-900",
  Ready: "bg-green-100 text-green-900",
  Completed: "bg-zinc-200 text-zinc-800",
  Cancelled: "bg-red-100 text-red-900",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${tones[status] || tones.Pending}`}
    >
      {status}
    </span>
  );
}
