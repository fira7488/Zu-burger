import { STORAGE_KEYS } from "./storageKeys";

export function createOrderId() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `ZU-${stamp}-${suffix}`;
}

export function getStoredOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.orders)) || [];
  } catch {
    return [];
  }
}

export function saveLocalOrder(order) {
  const orders = [order, ...getStoredOrders()];
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  localStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify(order));
}

export async function submitOrder(order) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    const result = await response.json();
    saveLocalOrder(order);

    if (!response.ok) {
      return {
        ok: false,
        fallback: false,
        error: result.error || "Order submission failed.",
      };
    }

    return result;
  } catch (error) {
    saveLocalOrder(order);
    return { ok: false, fallback: true, error: error.message };
  }
}

export function updateStoredOrderStatus(orderId, status) {
  const orders = getStoredOrders().map((order) =>
    order.id === orderId ? { ...order, status } : order,
  );

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.lastOrder);
    const lastOrder = raw ? JSON.parse(raw) : null;
    if (lastOrder && lastOrder.id === orderId) {
      localStorage.setItem(
        STORAGE_KEYS.lastOrder,
        JSON.stringify({ ...lastOrder, status }),
      );
    }
  } catch {
    // ignore parse errors
  }

  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  return orders;
}
