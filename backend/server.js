const app = require("./src/app");

// Render provides PORT dynamically
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
