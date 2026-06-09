import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStoredOrders, updateStoredOrderStatus } from "../../utils/orders";

export function useAdminOrders() {
  const { adminToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const headers = adminToken
        ? { Authorization: `Bearer ${adminToken}` }
        : {};
      const response = await fetch("/api/orders", { headers });
      if (!response.ok) {
        throw new Error("Failed to load orders.");
      }
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
      setFetchError("");
    } catch {
      setFetchError(
        "Unable to load orders from the server. Showing saved local orders.",
      );
      setOrders(getStoredOrders());
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateStatus = async (orderId, status) => {
    const nextOrders = updateStoredOrderStatus(orderId, status);
    setOrders(nextOrders);

    try {
      const headers = { "Content-Type": "application/json" };
      if (adminToken) {
        headers.Authorization = `Bearer ${adminToken}`;
      }
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });
    } catch {
      setFetchError("Could not update order status on the server.");
    }
  };

  return { orders, loading, fetchError, loadOrders, updateStatus };
}
