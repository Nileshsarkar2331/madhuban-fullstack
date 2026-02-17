const { supabase } = require("../config/supabase");
const { mapDbRow, mapDbRows } = require("../utils/dbMappers");

const throwIfError = (error) => {
  if (error) {
    throw error;
  }
};

exports.createReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { orderId, rating, comment, images } = req.body || {};

    if (!orderId || !rating) {
      return res.status(400).json({ message: "Order and rating are required" });
    }

    const parsedRating = Number(rating);
    if (parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Rating must be 1 to 5" });
    }

    const { data: orderRows, error: orderError } = await supabase
      .from("orders")
      .select("id, status, customer_username")
      .eq("id", String(orderId))
      .eq("user_id", String(userId))
      .limit(1);

    throwIfError(orderError);

    if (!orderRows || orderRows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = mapDbRow(orderRows[0]);

    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Order not delivered yet" });
    }

    const { data: existingRows, error: existingError } = await supabase
      .from("reviews")
      .select("id")
      .eq("order_id", String(orderId))
      .limit(1);

    throwIfError(existingError);

    if (existingRows && existingRows.length > 0) {
      return res.status(400).json({ message: "Review already submitted" });
    }

    const safeImages = Array.isArray(images) ? images.slice(0, 3) : [];
    if (safeImages.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        order_id: String(orderId),
        user_id: String(userId),
        username: String(order.customerUsername || ""),
        rating: parsedRating,
        comment: comment || "",
        images: safeImages,
        is_visible: false,
      })
      .select("*")
      .single();

    throwIfError(error);

    return res.status(201).json({
      message: "Review submitted",
      review: mapDbRow(data),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listReviews = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    throwIfError(error);

    return res.status(200).json({ reviews: mapDbRows(data) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listPublicReviews = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, comment, images, created_at, username, is_visible")
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .limit(6);

    throwIfError(error);

    return res.status(200).json({ reviews: mapDbRows(data) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateReviewVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisible } = req.body || {};

    const { data, error } = await supabase
      .from("reviews")
      .update({ is_visible: Boolean(isVisible) })
      .eq("id", id)
      .select("*")
      .limit(1);

    throwIfError(error);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json({
      message: "Updated",
      review: mapDbRow(data[0]),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
