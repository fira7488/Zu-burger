import CartItem from "../components/CartItem";
import EmptyState from "../components/EmptyState";
import OrderSummary from "../components/OrderSummary";
import SectionHeader from "../components/SectionHeader";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items } = useCart();

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Cart" title="Review your order" body="Adjust quantities, remove items, and continue to checkout when everything looks right." />
        {items.length === 0 ? (
          <EmptyState title="Your cart is empty" body="Add burgers, sides, or drinks from the menu to start your Zu Burger Spot order." />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="grid gap-4">{items.map((item) => <CartItem key={item.id} item={item} />)}</div>
            <OrderSummary />
          </div>
        )}
      </div>
    </section>
  );
}
