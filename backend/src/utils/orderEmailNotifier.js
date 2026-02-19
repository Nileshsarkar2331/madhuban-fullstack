const parseBool = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }
  const normalized = String(value).trim().toLowerCase();
  return ["1", "true", "yes", "on"].includes(normalized);
};

const getRecipients = () => {
  return String(process.env.ORDER_ALERT_EMAILS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const getMailConfig = () => {
  const recipients = getRecipients();
  return {
    enabled: parseBool(process.env.ORDER_EMAIL_NOTIFICATIONS, true),
    recipients,
    from:
      (process.env.ORDER_EMAIL_FROM || process.env.SMTP_FROM || "").trim() ||
      (process.env.SMTP_USER || "").trim() ||
      "",
    host: (process.env.SMTP_HOST || "").trim(),
    port: Number(process.env.SMTP_PORT || 587),
    secure: parseBool(process.env.SMTP_SECURE, false),
    user: (process.env.SMTP_USER || "").trim(),
    pass: process.env.SMTP_PASS || "",
  };
};

let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  let nodemailer;
  try {
    // Loaded lazily so app can still boot if dependency/env is missing.
    nodemailer = require("nodemailer");
  } catch (error) {
    return null;
  }

  const config = getMailConfig();
  if (!config.host || !config.port || !config.user || !config.pass) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  return cachedTransporter;
};

const formatCurrency = (value) => {
  const number = Number(value);
  const safe = Number.isFinite(number) ? number : 0;
  return `Rs ${safe.toFixed(2)}`;
};

const escapeHtml = (value) => {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const buildAddressLine = (address = {}) => {
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ]
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  return parts.join(", ");
};

const buildItemsText = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "No items listed";
  }

  return items
    .map((item) => {
      const name = String(item?.name || "Item");
      const qty = Number(item?.quantity) || 0;
      const price = formatCurrency(item?.price);
      return `- ${name} x ${qty} (${price})`;
    })
    .join("\n");
};

const buildEmailBody = (order) => {
  const orderId = String(order?._id || order?.id || "");
  const customerName =
    String(order?.customerName || "").trim() ||
    String(order?.address?.name || "").trim() ||
    "Customer";
  const customerPhone = String(order?.address?.phone || "").trim();
  const paymentMethod = String(order?.paymentMethod || "cod").toUpperCase();
  const total = formatCurrency(order?.totals?.orderTotal);
  const addressLine = buildAddressLine(order?.address);
  const itemsText = buildItemsText(order?.items);
  const createdAt = String(order?.createdAt || new Date().toISOString());

  return [
    "New order placed",
    "",
    `Order ID: ${orderId}`,
    `Placed At: ${createdAt}`,
    `Customer: ${customerName}`,
    `Phone: ${customerPhone || "-"}`,
    `Payment: ${paymentMethod}`,
    `Total: ${total}`,
    `Address: ${addressLine || "-"}`,
    "",
    "Items:",
    itemsText,
  ].join("\n");
};

const buildItemsRowsHtml = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return `
      <tr>
        <td colspan="4" style="padding:12px;border:1px solid #e5e7eb;text-align:center;color:#6b7280;">
          No items listed
        </td>
      </tr>
    `;
  }

  return items
    .map((item, idx) => {
      const name = escapeHtml(item?.name || "Item");
      const qty = Number(item?.quantity) || 0;
      const price = formatCurrency(item?.price);
      const lineTotal = formatCurrency((Number(item?.price) || 0) * qty);

      return `
        <tr>
          <td style="padding:10px;border:1px solid #e5e7eb;">${idx + 1}</td>
          <td style="padding:10px;border:1px solid #e5e7eb;">${name}</td>
          <td style="padding:10px;border:1px solid #e5e7eb;text-align:center;">${qty}</td>
          <td style="padding:10px;border:1px solid #e5e7eb;text-align:right;">${price}</td>
          <td style="padding:10px;border:1px solid #e5e7eb;text-align:right;">${lineTotal}</td>
        </tr>
      `;
    })
    .join("");
};

const buildEmailHtml = (order) => {
  const orderId = escapeHtml(String(order?._id || order?.id || ""));
  const customerName =
    String(order?.customerName || "").trim() ||
    String(order?.address?.name || "").trim() ||
    "Customer";
  const customerPhone = String(order?.address?.phone || "").trim() || "-";
  const paymentMethod = String(order?.paymentMethod || "cod").toUpperCase();
  const totals = order?.totals || {};
  const itemsTotal = formatCurrency(totals.itemsTotal);
  const deliveryFee = formatCurrency(totals.deliveryFee);
  const gst = formatCurrency(totals.gst);
  const orderTotal = formatCurrency(totals.orderTotal);
  const addressLine = buildAddressLine(order?.address) || "-";
  const createdAt = escapeHtml(String(order?.createdAt || new Date().toISOString()));
  const itemsRows = buildItemsRowsHtml(order?.items);

  return `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">
        <div style="max-width:760px;margin:24px auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
          <div style="background:#111827;color:#ffffff;padding:18px 22px;">
            <h2 style="margin:0;font-size:20px;line-height:1.3;">New Order Received</h2>
            <p style="margin:6px 0 0 0;font-size:13px;opacity:0.9;">Order #${orderId || "-"}</p>
          </div>

          <div style="padding:18px 22px;">
            <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:14px;">
              <tr>
                <td style="padding:8px 0;color:#6b7280;width:130px;">Placed At</td>
                <td style="padding:8px 0;">${createdAt}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#6b7280;">Customer</td>
                <td style="padding:8px 0;">${escapeHtml(customerName)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#6b7280;">Phone</td>
                <td style="padding:8px 0;">${escapeHtml(customerPhone)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#6b7280;">Payment</td>
                <td style="padding:8px 0;">${escapeHtml(paymentMethod)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#6b7280;">Address</td>
                <td style="padding:8px 0;">${escapeHtml(addressLine)}</td>
              </tr>
            </table>

            <table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px;">
              <thead>
                <tr style="background:#f9fafb;">
                  <th style="padding:10px;border:1px solid #e5e7eb;text-align:left;">#</th>
                  <th style="padding:10px;border:1px solid #e5e7eb;text-align:left;">Item</th>
                  <th style="padding:10px;border:1px solid #e5e7eb;text-align:center;">Qty</th>
                  <th style="padding:10px;border:1px solid #e5e7eb;text-align:right;">Price</th>
                  <th style="padding:10px;border:1px solid #e5e7eb;text-align:right;">Line Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <table style="width:320px;max-width:100%;margin-top:18px;margin-left:auto;border-collapse:collapse;font-size:14px;">
              <tr>
                <td style="padding:8px 0;color:#6b7280;">Items Total</td>
                <td style="padding:8px 0;text-align:right;">${escapeHtml(itemsTotal)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#6b7280;">Delivery Fee</td>
                <td style="padding:8px 0;text-align:right;">${escapeHtml(deliveryFee)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#6b7280;">GST</td>
                <td style="padding:8px 0;text-align:right;">${escapeHtml(gst)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;font-weight:700;border-top:1px solid #e5e7eb;">Order Total</td>
                <td style="padding:10px 0;text-align:right;font-weight:700;border-top:1px solid #e5e7eb;">${escapeHtml(
                  orderTotal
                )}</td>
              </tr>
            </table>
          </div>
        </div>
      </body>
    </html>
  `;
};

const sendOrderPlacedEmail = async (order) => {
  const config = getMailConfig();
  if (!config.enabled) {
    return { sent: false, reason: "disabled" };
  }
  if (!config.recipients.length) {
    return { sent: false, reason: "missing-recipients" };
  }
  if (!config.from) {
    return { sent: false, reason: "missing-from" };
  }

  const transporter = getTransporter();
  if (!transporter) {
    return { sent: false, reason: "missing-transporter-or-config" };
  }

  const orderId = String(order?._id || order?.id || "");
  const subject = `New Order Received${orderId ? ` #${orderId}` : ""}`;
  const text = buildEmailBody(order);
  const html = buildEmailHtml(order);

  await transporter.sendMail({
    from: config.from,
    to: config.recipients.join(", "),
    subject,
    text,
    html,
  });

  return { sent: true };
};

module.exports = {
  sendOrderPlacedEmail,
};
