import { ShoppingBag } from "lucide-react";
import Button from "./Button";

export default function EmptyState({ title, body, action = "Browse Menu", to = "/menu" }) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-yellow-100 text-red-800">
        <ShoppingBag size={28} />
      </div>
      <h2 className="mt-5 text-2xl font-black">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-zinc-600">{body}</p>
      <Button to={to} className="mt-6">
        {action}
      </Button>
    </div>
  );
}
