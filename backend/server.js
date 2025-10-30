const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { SpeechClient } = require("@google-cloud/speech");
const { PredictionServiceClient } = require("@google-cloud/aiplatform");

// This comment is added to force a new Cloud Run deployment.
console.log("Server.js: Application starting up.");

const apiRoutes = require("./src/routes/api");

// Initialize Google Cloud Speech client
const speech = new SpeechClient();

// Initialize Vertex AI client
const aiplatform = new PredictionServiceClient({
  apiEndpoint: "us-central1-aiplatform.googleapis.com",
});

console.log("Server.js: Attempting to connect to MongoDB...");
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Server.js: MongoDB Connected successfully'))
  .catch((err) => {
    console.error('Server.js: MongoDB connection error:', err);
    console.error('Server.js: MONGODB_URI used:', process.env.MONGODB_URI ? '****** (present)' : 'undefined');
  });

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
console.log(`🌐 CLIENT_URL: ${process.env.CLIENT_URL}`);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.status(200).send("Backend is running!");
});
app.use("/api", apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 8080;
console.log(`Server.js: Port to listen on: ${PORT}`);

console.log("Server.js: Calling app.listen...");
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`🔧 Google Cloud Project: ${process.env.GOOGLE_PROJECT_ID}`);
});
