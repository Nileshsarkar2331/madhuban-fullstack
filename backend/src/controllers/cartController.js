const Cart = require("../models/Cart");

/**
 * ADD ITEM TO CART
 */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { dishId, quantity = 1 } = req.body;

    if (!dishId) {
      return res.status(400).json({ message: "Dish ID is required" });
    }

    let cart = await Cart.findOne({ userId });

    // If cart does not exist, create new
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ dishId, quantity }],
      });
      return res.status(200).json(cart);
    }

    // Check if dish already exists
    const itemIndex = cart.items.findIndex(
      (item) => item.dishId.toString() === dishId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ dishId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET USER CART
 */
exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * REMOVE ITEM FROM CART
 */
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { dishId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.dishId.toString() !== dishId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE ITEM QUANTITY
 */
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.userId;
    const { dishId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.dishId.toString() === dishId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
