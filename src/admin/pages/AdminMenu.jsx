import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { categories as defaultCategories } from "../../data/menuItems";
import { formatCurrency } from "../../utils/currency";
import { useAuth } from "../../context/AuthContext";

const emptyItem = {
  id: "",
  name: "",
  category: "Signature Burgers",
  description: "",
  price: 0,
  featured: false,
  available: true,
  image: "",
};

export default function AdminMenu() {
  const { adminToken } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [error, setError] = useState("");

  const authHeaders = useCallback(
    () => ({
      "Content-Type": "application/json",
      ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
    }),
    [adminToken],
  );

  const loadMenu = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/menu");
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load menu items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const openCreate = () => {
    setEditing("new");
    setForm({ ...emptyItem, id: `item-${Date.now()}` });
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({ ...item, available: item.available !== false });
  };

  const closeForm = () => {
    setEditing(null);
    setForm(emptyItem);
    setError("");
  };

  const saveItem = async (event) => {
    event.preventDefault();
    setError("");

    const isNew = editing === "new";
    const url = isNew ? "/api/menu" : `/api/menu/${form.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Save failed.");
      }
      await loadMenu();
      closeForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    try {
      await fetch(`/api/menu/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      await loadMenu();
    } catch {
      setError("Could not delete item.");
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-red-800">
            Menu management
          </p>
          <h1 className="mt-1 text-3xl font-black text-zinc-950">Menu</h1>
          <p className="mt-2 text-zinc-600">
            Create, edit, and manage menu items and pricing.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2.5 text-sm font-black text-white hover:bg-red-700"
        >
          <Plus size={16} />
          Add item
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-900">
          {error}
        </p>
      )}

      {editing && (
        <form
          onSubmit={saveItem}
          className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-black">
            {editing === "new" ? "New menu item" : "Edit menu item"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} select options={defaultCategories.filter((c) => c !== "All")} />
            <Field label="Price (ETB)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} type="number" required />
            <Field label="Image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            <div className="sm:col-span-2">
              <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />
            </div>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured item
            </label>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
              />
              Available for ordering
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="submit" className="rounded-lg bg-red-800 px-4 py-2 text-sm font-black text-white">
              Save item
            </button>
            <button type="button" onClick={closeForm} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-bold">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-zinc-500">Loading menu...</p>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="flex min-w-0 items-center gap-4">
                {item.image && (
                  <img src={item.image} alt="" className="size-14 rounded-lg object-cover" />
                )}
                <div>
                  <p className="font-black text-zinc-950">
                    {item.name}
                    {item.available === false && (
                      <span className="ml-2 text-xs font-bold text-red-600">(Unavailable)</span>
                    )}
                  </p>
                  <p className="text-sm text-zinc-500">{item.category}</p>
                  <p className="text-sm font-bold text-red-800">{formatCurrency(item.price)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="rounded-lg border border-zinc-200 p-2 hover:bg-zinc-50"
                  aria-label={`Edit ${item.name}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="rounded-lg border border-red-200 p-2 text-red-700 hover:bg-red-50"
                  aria-label={`Delete ${item.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, select, options, textarea }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-zinc-700">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-24 w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-red-800"
          required={required}
        />
      ) : select ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-lg border border-zinc-200 px-3 outline-none focus:border-red-800"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-lg border border-zinc-200 px-3 outline-none focus:border-red-800"
          required={required}
        />
      )}
    </label>
  );
}
