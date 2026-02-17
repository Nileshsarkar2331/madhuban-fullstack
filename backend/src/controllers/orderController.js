const { supabase } = require("../config/supabase");
const { mapDbRow, mapDbRows } = require("../utils/dbMappers");
const webpush = require("web-push");

const throwIfError = (error) => {
  if (error) {
    throw error;
  }
};

const toSafeNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

exports.createOrder = async (req, res) => {
  try {
    const now = new Date();
    const IST_OFFSET_MIN = 330;
    const istNow = new Date(now.getTime() + IST_OFFSET_MIN * 60 * 1000);
    const minutes = istNow.getUTCHours() * 60 + istNow.getUTCMinutes();
    const openAt = 11 * 60 + 50;
    const closeAt = 22 * 60 + 30;
    if (minutes < openAt) {
      return res.status(400).json({ message: "Sorry, we are not open yet." });
    }
    if (minutes > closeAt) {
      return res.status(400).json({ message: "We are closed." });
    }

    const { address, items, totals, paymentMethod, customerName, customerUsername } =
      req.body || {};

    if (!address || !address.name || !address.phone || !address.addressLine1) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: req.user?.id || "",
        address,
        items,
        totals,
        payment_method: paymentMethod || "cod",
        customer_name: customerName || address.name || "",
        customer_username: customerUsername || "",
      })
      .select("*")
      .single();

    throwIfError(error);
    const order = mapDbRow(data);

    const vapidPublic = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
    if (vapidPublic && vapidPrivate) {
      webpush.setVapidDetails(
        "mailto:admin@madhuban.com",
        vapidPublic,
        vapidPrivate
      );

      const { data: subs, error: subsError } = await supabase
        .from("push_subscriptions")
        .select("endpoint, keys")
        .eq("is_admin", true);

      throwIfError(subsError);

      const payload = JSON.stringify({
        title: "New Order",
        body: `Order from ${order.address?.name || "Customer"} • ₹${
          order.totals?.orderTotal || 0
        }`,
        url: "/admin",
      });

      for (const sub of subs || []) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys,
            },
            payload
          );
        } catch {
          // ignore failed endpoints
        }
      }
    }

    return res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .neq("status", "delivered")
      .neq("status", "canceled")
      .order("created_at", { ascending: false });

    throwIfError(error);

    return res.status(200).json({ orders: mapDbRows(data) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id || "";
    if (!userId) {
      return res.status(200).json({ orders: [] });
    }

    const { data: allRows, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    throwIfError(ordersError);

    const allOrders = mapDbRows(allRows);
    const orders = allOrders.filter(
      (order) =>
        order.status !== "canceled" ||
        (order.status === "canceled" && !order.canceledSeenByUser)
    );

    const canceledToMark = orders
      .filter((order) => order.status === "canceled")
      .map((order) => order._id);

    if (canceledToMark.length > 0) {
      const { error: markError } = await supabase
        .from("orders")
        .update({ canceled_seen_by_user: true })
        .in("id", canceledToMark);

      throwIfError(markError);
    }

    const orderIds = orders.map((order) => String(order._id)).filter(Boolean);
    let reviewedSet = new Set();

    if (orderIds.length > 0) {
      const { data: reviewRows, error: reviewsError } = await supabase
        .from("reviews")
        .select("order_id")
        .in("order_id", orderIds);

      throwIfError(reviewsError);
      reviewedSet = new Set(
        (reviewRows || []).map((review) => String(review.order_id))
      );
    }

    const withFlags = orders.map((order) => ({
      ...order,
      reviewed: reviewedSet.has(String(order._id)),
    }));

    return res.status(200).json({ orders: withFlags });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    const allowed = new Set(["placed", "prepared", "delivered", "canceled"]);
    if (!allowed.has(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const update = { status };
    if (status === "canceled") {
      update.canceled_seen_by_user = false;
    }

    const { data, error } = await supabase
      .from("orders")
      .update(update)
      .eq("id", id)
      .select("*")
      .limit(1);

    throwIfError(error);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Status updated",
      order: mapDbRow(data[0]),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getMonthlyStats = async (req, res) => {
  try {
    const monthParam = String(req.query.month || "");
    let year = new Date().getFullYear();
    let monthIndex = new Date().getMonth();
    if (/^\d{4}-\d{2}$/.test(monthParam)) {
      const [y, m] = monthParam.split("-").map(Number);
      year = y;
      monthIndex = m - 1;
    }

    const start = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0));

    const { data, error } = await supabase
      .from("orders")
      .select("created_at, totals")
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString());

    throwIfError(error);

    const grouped = {};

    for (const row of data || []) {
      const mapped = mapDbRow(row);
      if (!mapped.createdAt) {
        continue;
      }
      const date = new Date(mapped.createdAt).toISOString().slice(0, 10);
      if (!grouped[date]) {
        grouped[date] = { date, orders: 0, revenue: 0 };
      }
      grouped[date].orders += 1;
      grouped[date].revenue += toSafeNumber(mapped.totals?.orderTotal);
    }

    const stats = Object.values(grouped).sort((a, b) =>
      String(a.date).localeCompare(String(b.date))
    );

    return res.status(200).json({
      month: `${year}-${String(monthIndex + 1).padStart(2, "0")}`,
      stats,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.cancelMyOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || "";

    const { data: rows, error: findError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .limit(1);

    throwIfError(findError);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = mapDbRow(rows[0]);

    if (order.status !== "placed") {
      return res.status(400).json({
        message:
          "Sorry, order can't be canceled because it is already prepared.",
      });
    }

    const { data: updatedRows, error: updateError } = await supabase
      .from("orders")
      .update({ status: "canceled", canceled_seen_by_user: false })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .limit(1);

    throwIfError(updateError);

    return res.status(200).json({
      message: "Order canceled",
      order: mapDbRow(updatedRows[0]),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getTodayDeliveredStats = async (req, res) => {
  try {
    const now = new Date();
    const IST_OFFSET_MIN = 330;
    const offsetMs = IST_OFFSET_MIN * 60 * 1000;
    const istNow = new Date(now.getTime() + offsetMs);
    const istStartUTC = new Date(
      Date.UTC(
        istNow.getUTCFullYear(),
        istNow.getUTCMonth(),
        istNow.getUTCDate(),
        0,
        0,
        0
      )
    );
    const start = new Date(istStartUTC.getTime() - offsetMs);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from("orders")
      .select("totals")
      .eq("status", "delivered")
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString());

    throwIfError(error);

    let orders = 0;
    let revenue = 0;

    for (const row of data || []) {
      const mapped = mapDbRow(row);
      orders += 1;
      revenue += toSafeNumber(mapped.totals?.orderTotal);
    }

    return res.status(200).json({
      date: istNow.toISOString().slice(0, 10),
      orders,
      revenue,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
