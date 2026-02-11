import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

type Order = {
  _id: string;
  createdAt: string;
  status?: string;
  totals?: {
    orderTotal?: number;
  };
  address: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  items?: Array<{
    dishId: string;
    name?: string;
    quantity?: number;
    price?: number;
  }>;
};

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/orders/my`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          const text = await res.text();
          let data: any = {};
          try {
            data = text ? JSON.parse(text) : {};
          } catch {
            data = {};
          }
          throw new Error(data.message || "Failed to load orders");
        }
        const data = await res.json();
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err: any) {
        setError(err?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 px-4 py-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Orders</h1>
      </div>

      {loading && (
        <div className="text-sm text-muted-foreground">Loading orders...</div>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}
      {!loading && !error && orders.length === 0 && (
        <div className="text-sm text-muted-foreground">No orders yet.</div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-semibold">
                {order.address?.name || "Customer"}
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Status:{" "}
              <Badge className="bg-secondary/10 text-secondary border border-secondary/20">
                {order.status || "placed"}
              </Badge>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Address: {order.address?.addressLine1}
              {order.address?.addressLine2 ? `, ${order.address.addressLine2}` : ""}
              {order.address?.landmark ? `, ${order.address.landmark}` : ""}
              {order.address?.city ? `, ${order.address.city}` : ""}
              {order.address?.state ? `, ${order.address.state}` : ""}
              {order.address?.pincode ? ` - ${order.address.pincode}` : ""}
            </div>
            <div className="mt-3 text-sm">Total: ₹{order.totals?.orderTotal ?? 0}</div>

            {order.items && order.items.length > 0 && (
              <div className="mt-3 text-sm">
                <div className="font-medium text-foreground">Items</div>
                <div className="mt-2 space-y-1">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${order._id}-${item.dishId}-${idx}`}
                      className="flex items-center justify-between text-muted-foreground"
                    >
                      <span>
                        {item.name || item.dishId} × {item.quantity ?? 1}
                      </span>
                      <span>
                        ₹{(item.price || 0) * (item.quantity ?? 1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
