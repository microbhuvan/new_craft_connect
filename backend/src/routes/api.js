const express = require("express");
const multer = require("multer");
const aiController = require("../controllers/aiController");
const imageController = require("../controllers/imageController");
const productController = require("../controllers/productController");

const router = express.Router();

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// --- EXISTING API ENDPOINTS ---

// Handles audio analysis (Speech-to-Text and Vertex AI)
router.post(
  "/analyze-business",
  upload.single("audio"),
  aiController.analyzeBusinessAudio
);

// Handles WhatsApp message generation
router.post(
  "/generate-whatsapp-message",
  upload.single("image"),
  aiController.generateWhatsAppMessage
);

// --- NEW API ENDPOINTS ---

// Image upload and Vision AI analysis
router.post(
  "/image/upload",
  upload.single("image"),
  imageController.uploadAndAnalyze
);

// AI processing pipeline (transcript + image -> product summary + enhancement)
router.post(
  "/ai/process",
  productController.processProduct
);

// Product management
router.get(
  "/products/:id",
  productController.getProduct
);

router.post(
  "/products/:id/approve",
  productController.approveProduct
);

module.exports = router;