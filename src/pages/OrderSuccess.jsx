import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import { getStoredOrders } from "../utils/orders";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const storedOrder = getStoredOrders().find(
        (order) => order.id === orderId,
      );
      if (storedOrder) {
        setOrder(storedOrder);
        return;
      }
      const raw = localStorage.getItem("zu-burger-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      setOrder(null);
    }
  }, [orderId]);

  const confirmed = order && order.status !== "Awaiting Verification";
  const title = confirmed ? "Order confirmed" : "Order received";
  const message = confirmed
    ? "Your payment was verified and your order is being prepared."
    : "We are verifying your payment and will update you shortly.";

  return (
    <section className="grid min-h-[68vh] place-items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-2xl shadow-red-950/10">
        <div
          className={`mx-auto grid size-20 place-items-center rounded-full ${confirmed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}`}
        >
          <CheckCircle2 size={42} />
        </div>
        <h1 className="mt-6 text-4xl font-black">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-zinc-600">{message}</p>
        <div className="mx-auto mt-6 rounded-lg bg-zinc-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
            Order number
          </p>
          <p className="mt-1 text-xl font-black text-red-800">{orderId}</p>
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button to="/order-tracking">Track order</Button>
          <Button to="/menu" variant="outline">
            Order more
          </Button>
          <Button to="/" variant="outline">
            Return to home
          </Button>
        </div>
      </div>
    </section>
  );
}
