import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import zuLogo from "../assets/images/zu-logo-social.jpg";
import { useCart } from "../context/CartContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/order-tracking", label: "Track Order" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-bold transition ${
      isActive
        ? "bg-zinc-950 text-yellow-300"
        : "text-zinc-700 hover:bg-yellow-50 hover:text-zinc-950"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="flex items-center gap-3"
          aria-label="Zu Burger Spot home"
        >
          <img
            className="size-12 rounded-full border-2 border-yellow-400 object-cover"
            src={zuLogo}
            alt="Zu Burger Spot logo"
          />
          <span>
            <span className="block text-lg font-black leading-none text-zinc-950">
              Zu Burger Spot
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-yellow-600">
              Shashemene
            </span>
          </span>
        </NavLink>

        <nav
          className="hidden items-center gap-2 md:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavLink
            to="/cart"
            className="relative grid size-11 place-items-center rounded-full bg-zinc-950 text-white transition hover:bg-yellow-500 hover:text-zinc-950 focus:outline-none focus:ring-4 focus:ring-yellow-300"
            aria-label={`Cart with ${itemCount} items`}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-yellow-400 px-1 text-xs font-black text-zinc-950">
                {itemCount}
              </span>
            )}
          </NavLink>
          <div className="hidden sm:block">
            <span className="inline-flex h-9 items-center rounded-full border border-zinc-200 bg-white px-3 text-sm text-zinc-700">
              EN
            </span>
          </div>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-zinc-200 text-zinc-900 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 md:hidden">
          <nav
            id="mobile-menu"
            className="mx-auto grid max-w-7xl gap-2"
            aria-label="Mobile navigation"
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
