// ...existing imports
const apiRoutes = require("./src/routes/api");
const shopifyRoutes = require("./src/routes/shopify");
const facebookRoutes = require("./src/routes/facebook");

// ...existing middleware

// Routes
app.get("/", (req, res) => {
  res.status(200).send("Backend is running!");
});
app.use("/api", apiRoutes);
app.use("/api/shopify", shopifyRoutes);
app.use("/api/facebook", facebookRoutes);

// ...existing error handling and listen