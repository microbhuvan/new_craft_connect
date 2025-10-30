import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://craftconnectf-496852567950.europe-west1.run.app/api";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
});

export const analyzeBusinessAudio = (audioBlob, options = {}) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  return apiClient.post("/analyze-business", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    ...options,
  });
};

export const generateWhatsAppMessage = (data) => {
  return apiClient.post("/generate-whatsapp-message", data);
};
