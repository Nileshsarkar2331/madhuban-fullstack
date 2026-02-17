const { ensureSupabaseConfigured } = require("./supabase");

const connectDB = async () => {
  ensureSupabaseConfigured();
  console.log("✅ Supabase configured");
};

module.exports = connectDB;
