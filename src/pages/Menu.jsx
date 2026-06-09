import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { categories, menuItems as fallbackMenu } from "../data/menuItems";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [menuItems, setMenuItems] = useState(fallbackMenu);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => (res.ok ? res.json() : fallbackMenu))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMenuItems(data.filter((item) => item.available !== false));
        }
      })
      .catch(() => setMenuItems(fallbackMenu));
  }, []);

  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, query, menuItems]);

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Menu"
          title="Explore Zu Burger Spot"
          body="Search, filter, and build an order from signature burgers, family favorites, sides, and drinks."
        />
        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block">
            <span className="sr-only">Search menu</span>
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              size={20}
            />
            <input
              className="h-14 w-full rounded-full border border-zinc-200 bg-white pl-12 pr-4 text-zinc-950 outline-none transition focus:border-red-800 focus:ring-4 focus:ring-yellow-200"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the menu"
            />
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                className={`shrink-0 rounded-full px-4 py-3 text-sm font-black transition ${
                  activeCategory === category
                    ? "bg-red-800 text-white"
                    : "bg-white text-zinc-700 hover:bg-red-50"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No menu items found"
            body="Try a different search or switch categories to keep building your order."
          />
        )}
      </div>
    </section>
  );
}
