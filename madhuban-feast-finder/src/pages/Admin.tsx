import React, { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  ChefHat,
  LayoutDashboard,
  MessageSquare,
  Package,
  ShoppingBag,
  Star,
  User,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

type AdminSection =
  | "dashboard"
  | "menu"
  | "orders"
  | "stats"
  | "messages"
  | "reviews"
  | "account";

const Admin = () => {
  const [active, setActive] = useState<AdminSection>("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<Array<{ date: string; orders: number; revenue: number }>>([]);
  const [statsError, setStatsError] = useState("");
  const [todayOrders, setTodayOrders] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [reviews, setReviews] = useState<
    Array<{
      _id: string;
      orderId: string;
      rating: number;
      comment?: string;
      images?: string[];
      createdAt: string;
    }>
  >([]);
  const [reviewsError, setReviewsError] = useState("");
  const [unseenCount, setUnseenCount] = useState(0);
  const lastSeenRef = useRef<number>(Date.now());
  const [pushError, setPushError] = useState("");

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };
  const totalOrders = orders.length;
  const totalRevenue = useMemo(
    () =>
      orders.reduce((sum, order) => sum + (order.totals?.orderTotal || 0), 0),
    [orders]
  );

  useEffect(() => {
    const fetchOrders = async (markSeen = false) => {
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
        const nextOrders = Array.isArray(data.orders) ? data.orders : [];
        setOrders(nextOrders);

        if (markSeen) {
          lastSeenRef.current = Date.now();
          setUnseenCount(0);
        } else {
          const unseen = nextOrders.filter((order: Order) => {
            const ts = new Date(order.createdAt).getTime();
            return ts > lastSeenRef.current;
          }).length;
          setUnseenCount(unseen);
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders(true);
    const id = window.setInterval(() => fetchOrders(false), 10000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const setupPush = async () => {
      try {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
          return;
        }
        const publicKey = (import.meta.env.VITE_VAPID_PUBLIC_KEY as string)?.trim();
        if (!publicKey) {
          return;
        }
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setPushError("Notifications are blocked. Please allow them in browser settings.");
          return;
        }
        await navigator.serviceWorker.register("/sw.js");
        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();
        const subscription =
          existing ||
          (await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          }));

        const token = localStorage.getItem("token");
        await fetch(`${API_BASE_URL}/api/notifications/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(subscription),
        });
      } catch (err: any) {
        setPushError(err?.message || "Failed to enable notifications");
      }
    };

    setupPush();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/reviews`, {
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
          throw new Error(data.message || "Failed to load reviews");
        }
        const data = await res.json();
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      } catch (err: any) {
        setReviewsError(err?.message || "Failed to load reviews");
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsError("");
      try {
        const token = localStorage.getItem("token");
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        const res = await fetch(`${API_BASE_URL}/api/orders/stats?month=${month}`, {
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
          throw new Error(data.message || "Failed to load stats");
        }
        const data = await res.json();
        setStats(Array.isArray(data.stats) ? data.stats : []);
      } catch (err: any) {
        setStatsError(err?.message || "Failed to load stats");
      }
    };

    const fetchToday = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/orders/stats/today`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setTodayOrders(Number(data.orders || 0));
        setTodayRevenue(Number(data.revenue || 0));
      } catch {
        // ignore
      }
    };

    fetchStats();
    fetchToday();
    const id = window.setInterval(() => {
      fetchStats();
      fetchToday();
    }, 10000);
    return () => window.clearInterval(id);
  }, []);

  const updateStatus = async (orderId: string, status: "prepared" | "delivered") => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const text = await res.text();
        let data: any = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = {};
        }
        throw new Error(data.message || "Failed to update status");
      }
      const data = await res.json();
      setOrders((prev) =>
        status === "delivered"
          ? prev.filter((order) => order._id !== orderId)
          : prev.map((order) => (order._id === orderId ? data.order : order))
      );
    } catch (err: any) {
      alert(err?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f1ea] via-[#f8f5ef] to-[#f0f6ef]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          <aside className="rounded-3xl bg-[#3f3a33] text-white shadow-xl overflow-hidden">
            <div className="px-5 sm:px-6 py-5 sm:py-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#f28b5b] flex items-center justify-center shadow-lg">
                  <ChefHat className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-semibold">Madhuban</div>
                  <div className="text-xs text-white/60">
                    Serving Delicious Food
                  </div>
                </div>
              </div>
            </div>

            <div className="px-3 sm:px-4 py-4 sm:py-6">
              <div className="flex lg:block gap-2 overflow-x-auto pb-2 lg:pb-0">
                {[
                  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                  { id: "menu", label: "Product", icon: Package },
                  { id: "orders", label: "Order List", icon: ShoppingBag },
                  { id: "stats", label: "Statistics", icon: BarChart3 },
                  { id: "messages", label: "Messages", icon: MessageSquare },
                  { id: "reviews", label: "Reviews", icon: Star },
                  { id: "account", label: "Account", icon: User },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActive(item.id as AdminSection)}
                      className={`shrink-0 lg:w-full flex items-center gap-2 sm:gap-3 px-4 py-2.5 lg:py-3 rounded-2xl text-sm font-medium transition ${
                        isActive
                          ? "bg-[#f28b5b] text-white shadow-md"
                          : "text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {item.id === "orders" && unseenCount > 0 && (
                        <span className="ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white text-[#3f3a33] text-xs font-semibold px-1">
                          {unseenCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="rounded-3xl bg-white shadow-xl border border-border/60 p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-secondary">Admin Panel</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                  {active === "menu"
                    ? "Menu Manager"
                    : active === "orders"
                    ? "Order List"
                    : "Dashboard"}
                </h1>
              </div>
              <Badge className="bg-primary/10 text-primary border border-primary/20">
                {totalOrders} Orders
              </Badge>
            </div>

            {active === "dashboard" && (
              <div className="mt-8 space-y-6">
                {pushError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {pushError}
                  </div>
                )}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-border/60 p-5">
                    <div className="text-sm text-muted-foreground">
                      Delivered Today
                    </div>
                    <div className="text-2xl font-semibold">{todayOrders}</div>
                  </div>
                  <div className="rounded-2xl border border-border/60 p-5">
                    <div className="text-sm text-muted-foreground">
                      Revenue Today
                    </div>
                    <div className="text-2xl font-semibold">₹{todayRevenue}</div>
                  </div>
                  <div className="rounded-2xl border border-border/60 p-5">
                    <div className="text-sm text-muted-foreground">
                      Delivery
                    </div>
                    <div className="text-2xl font-semibold">COD</div>
                  </div>
                </div>
              </div>
            )}

            {active === "menu" && (
              <div className="mt-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
                <div className="rounded-2xl border border-border/60 p-5">
                  <div className="font-semibold">Add New Menu Item</div>
                  <div className="mt-4 grid gap-3">
                    <Input placeholder="Dish name" />
                    <Input placeholder="Category (e.g. starters)" />
                    <Input placeholder="Price" type="number" />
                    <Textarea placeholder="Short description" />
                    <Input placeholder="Image URL" />
                    <div className="flex gap-2">
                      <Button className="bg-primary text-primary-foreground">
                        Save Item
                      </Button>
                      <Button variant="outline">Reset</Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 p-5">
                  <div className="font-semibold">Quick Controls</div>
                  <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Show item in menu</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Mark as popular</span>
                      <input type="checkbox" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Enable online order</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {active === "orders" && (
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
                          {order.address?.name ||
                            order.customerName ||
                            "Customer"}
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
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge className="bg-secondary/10 text-secondary border border-secondary/20">
                        {order.status || "placed"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(order._id, "prepared")}
                      >
                        Prepared
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(order._id, "delivered")}
                      >
                        Delivered
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(order._id, "canceled")}
                      >
                        Cancel
                      </Button>
                    </div>
                      {order.items && order.items.length > 0 && (
                        <div className="mt-3 text-sm">
                          <div className="font-medium text-foreground">
                            Ordered Items
                          </div>
                          <div className="mt-2 space-y-1">
                            {order.items.map((item, idx) => (
                              <div
                                key={`${order._id}-${item.dishId}-${idx}`}
                                className="flex items-center justify-between text-muted-foreground"
                              >
                                <span>
                                  {item.name || item.dishId} ×{" "}
                                  {item.quantity ?? 1}
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
            )}

            {active === "stats" && (
              <div className="mt-8">
                <div className="rounded-2xl border border-border/60 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Daily Orders & Revenue
                      </div>
                      <div className="text-lg font-semibold">This Month</div>
                    </div>
                  </div>
                  {statsError && (
                    <div className="mt-3 text-sm text-red-500">
                      {statsError}
                    </div>
                  )}
                  {!statsError && stats.length === 0 && (
                    <div className="mt-3 text-sm text-muted-foreground">
                      No data yet.
                    </div>
                  )}
                  {stats.length > 0 && (
                    <div className="mt-4 h-64 sm:h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="orders" fill="#2f7a45" name="Orders" />
                          <Bar dataKey="revenue" fill="#f28b5b" name="Revenue" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            )}

            {active !== "dashboard" &&
              active !== "menu" &&
              active !== "orders" &&
              active !== "stats" && (
                <div className="mt-8 text-sm text-muted-foreground">
                  This section is ready for your data.
                </div>
              )}

            {active === "reviews" && (
              <div className="mt-8">
                <div className="text-lg font-semibold">Customer Reviews</div>
                {reviewsError && (
                  <div className="mt-3 text-sm text-red-500">{reviewsError}</div>
                )}
                {!reviewsError && reviews.length === 0 && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    No reviews yet.
                  </div>
                )}
                <div className="mt-4 grid grid-cols-1 gap-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="rounded-2xl border border-border/60 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-semibold">
                          Rating: {review.rating} / 5
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {review.comment && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          {review.comment}
                        </div>
                      )}
                      {review.images && review.images.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {review.images.map((src, idx) => (
                            <img
                              key={`${review._id}-${idx}`}
                              src={src}
                              alt="Review"
                              className="h-20 w-full rounded-lg object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Admin;
