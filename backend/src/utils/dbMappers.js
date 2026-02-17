const parseJsonIfNeeded = (value, fallback) => {
  if (value == null) {
    return fallback;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed;
    } catch {
      return fallback;
    }
  }
  return value;
};

const mapDbRow = (row) => {
  if (!row || typeof row !== "object") {
    return row;
  }

  const mapped = { ...row };

  if (mapped.id !== undefined && mapped._id === undefined) {
    mapped._id = String(mapped.id);
  }
  if (mapped.created_at !== undefined && mapped.createdAt === undefined) {
    mapped.createdAt = mapped.created_at;
  }
  if (mapped.updated_at !== undefined && mapped.updatedAt === undefined) {
    mapped.updatedAt = mapped.updated_at;
  }

  if (mapped.category_id !== undefined && mapped.categoryId === undefined) {
    mapped.categoryId = mapped.category_id;
  }
  if (mapped.order_id !== undefined && mapped.orderId === undefined) {
    mapped.orderId = mapped.order_id;
  }
  if (mapped.user_id !== undefined && mapped.userId === undefined) {
    mapped.userId = mapped.user_id;
  }

  if (mapped.is_visible !== undefined && mapped.isVisible === undefined) {
    mapped.isVisible = mapped.is_visible;
  }
  if (mapped.is_admin !== undefined && mapped.isAdmin === undefined) {
    mapped.isAdmin = mapped.is_admin;
  }
  if (mapped.is_verified !== undefined && mapped.isVerified === undefined) {
    mapped.isVerified = mapped.is_verified;
  }

  if (
    mapped.customer_name !== undefined &&
    mapped.customerName === undefined
  ) {
    mapped.customerName = mapped.customer_name;
  }
  if (
    mapped.customer_username !== undefined &&
    mapped.customerUsername === undefined
  ) {
    mapped.customerUsername = mapped.customer_username;
  }
  if (
    mapped.payment_method !== undefined &&
    mapped.paymentMethod === undefined
  ) {
    mapped.paymentMethod = mapped.payment_method;
  }
  if (
    mapped.canceled_seen_by_user !== undefined &&
    mapped.canceledSeenByUser === undefined
  ) {
    mapped.canceledSeenByUser = mapped.canceled_seen_by_user;
  }

  if (mapped.expires_at !== undefined && mapped.expiresAt === undefined) {
    mapped.expiresAt = mapped.expires_at;
  }

  if (mapped.address !== undefined) {
    mapped.address = parseJsonIfNeeded(mapped.address, {});
  }
  if (mapped.items !== undefined) {
    mapped.items = parseJsonIfNeeded(mapped.items, []);
  }
  if (mapped.totals !== undefined) {
    mapped.totals = parseJsonIfNeeded(mapped.totals, {});
  }
  if (mapped.images !== undefined) {
    mapped.images = parseJsonIfNeeded(mapped.images, []);
  }
  if (mapped.keys !== undefined) {
    mapped.keys = parseJsonIfNeeded(mapped.keys, {});
  }

  return mapped;
};

const mapDbRows = (rows) => {
  if (!Array.isArray(rows)) {
    return [];
  }
  return rows.map(mapDbRow);
};

module.exports = {
  mapDbRow,
  mapDbRows,
};
