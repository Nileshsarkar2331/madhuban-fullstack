import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

type Order = {
  _id: string;
  createdAt: string;
  customerName?: string;
  customerUsername?: string;
  paymentMethod?: string;
  status?: string;
  totals?: {
    orderTotal?: number;
  };
  address: {
    name: string;
    phone: string;
    altPhone?: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
    instructions?: string;
  };
  items?: Array<{
    dishId: string;
    name?: string;
    quantity?: number;
    price?: number;
  }>;
};

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/orders`, {
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl border border-border/60 bg-white shadow-xl p-6 sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-secondary">Admin Panel</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                Dashboard
              </h1>
            </div>
          </div>

          <div className="mt-8">
            <div className="text-lg font-semibold">Recent Orders</div>
            {loading && (
              <div className="mt-4 text-sm text-muted-foreground">
                Loading orders...
              </div>
            )}
            {error && (
              <div className="mt-4 text-sm text-red-500">{error}</div>
            )}
            {!loading && !error && orders.length === 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                No orders yet.
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-2xl border border-border/60 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold">
                      {order.address?.name || order.customerName || "Customer"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Phone: {order.address?.phone}
                    {order.address?.altPhone
                      ? ` | Alt: ${order.address.altPhone}`
                      : ""}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Address: {order.address?.addressLine1}
                    {order.address?.addressLine2
                      ? `, ${order.address.addressLine2}`
                      : ""}
                    {order.address?.landmark
                      ? `, ${order.address.landmark}`
                      : ""}
                    {order.address?.city ? `, ${order.address.city}` : ""}
                    {order.address?.state ? `, ${order.address.state}` : ""}
                    {order.address?.pincode
                      ? ` - ${order.address.pincode}`
                      : ""}
                  </div>
                  {order.address?.instructions && (
                    <div className="mt-1 text-sm text-muted-foreground">
                      Instructions: {order.address.instructions}
                    </div>
                  )}
                  <div className="mt-3 text-sm">
                    Total: ₹{order.totals?.orderTotal ?? 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
