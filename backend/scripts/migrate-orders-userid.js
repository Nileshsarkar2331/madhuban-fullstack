/* eslint-disable no-console */
require("dotenv").config();
const { createSupabaseRestClient } = require("../src/config/supabase");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
}

const supabase = createSupabaseRestClient(supabaseUrl, supabaseServiceRoleKey);

const run = async () => {
  const { data: nullUserRows, error: nullError } = await supabase
    .from("orders")
    .select("id, customer_username, user_id")
    .is("user_id", null);

  if (nullError) {
    throw nullError;
  }

  const { data: emptyUserRows, error: emptyError } = await supabase
    .from("orders")
    .select("id, customer_username, user_id")
    .eq("user_id", "");

  if (emptyError) {
    throw emptyError;
  }

  const rowsById = new Map();
  for (const row of [...(nullUserRows || []), ...(emptyUserRows || [])]) {
    rowsById.set(row.id, row);
  }
  const orders = Array.from(rowsById.values());

  console.log(`Found ${orders.length} orders without user_id`);

  let updated = 0;
  let skipped = 0;

  for (const order of orders) {
    const username = String(order.customer_username || "").trim();
    if (!username) {
      skipped += 1;
      continue;
    }

    const { data: users, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .limit(1);

    if (userError) {
      throw userError;
    }

    const user = users?.[0];
    if (!user) {
      skipped += 1;
      continue;
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({ user_id: String(user.id) })
      .eq("id", order.id);

    if (updateError) {
      throw updateError;
    }

    updated += 1;
  }

  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log("✅ Done");
};

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
