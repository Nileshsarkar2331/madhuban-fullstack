import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

type Order = {
  _id: string;
  createdAt: string;
  status?: string;
  reviewed?: boolean;
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
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState<Record<string, boolean>>({});
  const [reviewRating, setReviewRating] = useState<Record<string, number>>({});
  const [reviewComment, setReviewComment] = useState<Record<string, string>>({});
  const [reviewImages, setReviewImages] = useState<Record<string, string[]>>({});

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

  const cancelOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmed) return;

    setActionLoading(orderId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/orders/my/${orderId}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }
      if (!res.ok) {
        alert(data.message || "Unable to cancel order");
        return;
      }
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err: any) {
      alert(err?.message || "Unable to cancel order");
    } finally {
      setActionLoading(null);
    }
  };

  const handleImageChange = async (orderId: string, files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files).slice(0, 3);
    const readers = fileArray.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.readAsDataURL(file);
        })
    );
    const results = await Promise.all(readers);
    setReviewImages((prev) => ({ ...prev, [orderId]: results }));
  };

  const submitReview = async (orderId: string) => {
    const rating = reviewRating[orderId] || 0;
    if (rating < 1 || rating > 5) {
      alert("Please provide a rating between 1 and 5.");
      return;
    }
    setActionLoading(orderId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          orderId,
          rating,
          comment: reviewComment[orderId] || "",
          images: reviewImages[orderId] || [],
        }),
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }
      if (!res.ok) {
        alert(data.message || "Failed to submit review");
        return;
      }
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, reviewed: true } : order
        )
      );
      setReviewOpen((prev) => ({ ...prev, [orderId]: false }));
    } catch (err: any) {
      alert(err?.message || "Failed to submit review");
    } finally {
      setActionLoading(null);
    }
  };

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
        <div className="flex flex-col items-start gap-3">
          <div className="text-sm text-muted-foreground">No orders yet.</div>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Back to Home
          </Button>
        </div>
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
            {order.status === "placed" ? (
              <div className="mt-3">
                <button
                  type="button"
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                  onClick={() => cancelOrder(order._id)}
                  disabled={actionLoading === order._id}
                >
                  {actionLoading === order._id ? "Canceling..." : "Cancel Order"}
                </button>
              </div>
            ) : (
              <div className="mt-3 text-xs text-muted-foreground">
                Sorry, order can't be canceled because it is already prepared.
              </div>
            )}

            {order.status === "delivered" && !order.reviewed && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setReviewOpen((prev) => ({
                      ...prev,
                      [order._id]: !prev[order._id],
                    }))
                  }
                >
                  Leave Review
                </Button>
              </div>
            )}
            {order.reviewed && (
              <div className="mt-3 text-xs text-muted-foreground">
                Review submitted. Thank you!
              </div>
            )}

            {reviewOpen[order._id] && (
              <div className="mt-4 rounded-xl border border-border/60 p-4">
                <div className="text-sm font-medium">Your Rating</div>
                <div className="mt-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewRating((prev) => ({
                          ...prev,
                          [order._id]: star,
                        }))
                      }
                      className={`h-8 w-8 flex items-center justify-center rounded-full ${
                        (reviewRating[order._id] || 0) >= star
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                      aria-label={`Rate ${star} star`}
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <Textarea
                    placeholder="Write your comments..."
                    value={reviewComment[order._id] || ""}
                    onChange={(e) =>
                      setReviewComment((prev) => ({
                        ...prev,
                        [order._id]: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="mt-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageChange(order._id, e.target.files)}
                  />
                </div>
                {reviewImages[order._id]?.length ? (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {reviewImages[order._id].map((src, idx) => (
                      <img
                        key={`${order._id}-img-${idx}`}
                        src={src}
                        alt="Review upload"
                        className="h-20 w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                ) : null}
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => submitReview(order._id)}
                    disabled={actionLoading === order._id}
                  >
                    {actionLoading === order._id ? "Submitting..." : "Submit Review"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setReviewOpen((prev) => ({ ...prev, [order._id]: false }))
                    }
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

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
