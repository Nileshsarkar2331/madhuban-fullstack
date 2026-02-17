const { supabase } = require("../config/supabase");

const throwIfError = (error) => {
  if (error) {
    throw error;
  }
};

exports.subscribe = async (req, res) => {
  try {
    const { endpoint, keys } = req.body || {};
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ message: "Invalid subscription" });
    }

    const isAdmin = Boolean(req.user?.isAdmin);

    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        endpoint,
        keys,
        is_admin: isAdmin,
      },
      { onConflict: "endpoint" }
    );

    throwIfError(error);

    return res.status(200).json({ message: "Subscribed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
