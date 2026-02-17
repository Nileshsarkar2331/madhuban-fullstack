const { supabase } = require("../config/supabase");
const { mapDbRow, mapDbRows } = require("../utils/dbMappers");

const throwIfError = (error) => {
  if (error) {
    throw error;
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { name, price, categoryId } = req.body || {};
    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: "Name, price, category required" });
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        name: String(name).trim(),
        price: parsedPrice,
        category_id: String(categoryId).trim(),
      })
      .select("*")
      .single();

    throwIfError(error);

    return res.status(201).json({
      message: "Menu item added",
      item: mapDbRow(data),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listMenuItems = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("created_at", { ascending: false });

    throwIfError(error);

    return res.status(200).json({ items: mapDbRows(data) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id)
      .select("id")
      .limit(1);

    throwIfError(error);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.status(200).json({ message: "Menu item deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
