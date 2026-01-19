const app = require("./src/app");

const PORT = process.env.PORT || 5050;

// IMPORTANT: bind to 0.0.0.0 for Render
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
