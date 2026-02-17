const { supabase } = require("../config/supabase");
const { mapDbRow } = require("../utils/dbMappers");

const throwIfError = (error) => {
  if (error) {
    throw error;
  }
};

const getCartByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", userId)
    .limit(1);

  throwIfError(error);

  if (!data || data.length === 0) {
    return null;
  }

  return mapDbRow(data[0]);
};

/**
 * ADD ITEM TO CART
 */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { dishId, quantity = 1 } = req.body;

    if (!dishId) {
      return res.status(400).json({ message: "Dish ID is required" });
    }

    const parsedQty = Math.max(1, Number(quantity) || 1);

    let cart = await getCartByUserId(userId);

    if (!cart) {
      const { data, error } = await supabase
        .from("carts")
        .insert({
          user_id: userId,
          items: [{ dishId, quantity: parsedQty }],
        })
        .select("*")
        .single();

      throwIfError(error);
      return res.status(200).json(mapDbRow(data));
    }

    const items = Array.isArray(cart.items) ? [...cart.items] : [];
    const itemIndex = items.findIndex((item) => String(item.dishId) === String(dishId));

    if (itemIndex > -1) {
      const currentQty = Number(items[itemIndex].quantity) || 0;
      items[itemIndex] = {
        ...items[itemIndex],
        quantity: currentQty + parsedQty,
      };
    } else {
      items.push({ dishId, quantity: parsedQty });
    }

    const { data: updatedRows, error: updateError } = await supabase
      .from("carts")
      .update({ items })
      .eq("id", cart._id)
      .select("*")
      .limit(1);

    throwIfError(updateError);

    return res.status(200).json(mapDbRow(updatedRows[0]));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET USER CART
 */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const cart = await getCartByUserId(userId);

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * REMOVE ITEM FROM CART
 */
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { dishId } = req.params;

    const cart = await getCartByUserId(userId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const items = (Array.isArray(cart.items) ? cart.items : []).filter(
      (item) => String(item.dishId) !== String(dishId)
    );

    const { data: updatedRows, error: updateError } = await supabase
      .from("carts")
      .update({ items })
      .eq("id", cart._id)
      .select("*")
      .limit(1);

    throwIfError(updateError);

    return res.status(200).json(mapDbRow(updatedRows[0]));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE ITEM QUANTITY
 */
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { dishId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await getCartByUserId(userId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const items = Array.isArray(cart.items) ? [...cart.items] : [];
    const itemIndex = items.findIndex((item) => String(item.dishId) === String(dishId));

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    items[itemIndex] = {
      ...items[itemIndex],
      quantity: Number(quantity),
    };

    const { data: updatedRows, error: updateError } = await supabase
      .from("carts")
      .update({ items })
      .eq("id", cart._id)
      .select("*")
      .limit(1);

    throwIfError(updateError);

    return res.status(200).json(mapDbRow(updatedRows[0]));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
