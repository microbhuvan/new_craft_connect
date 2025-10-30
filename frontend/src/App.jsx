import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import InsightsPage from "./pages/InsightsPage";
import WhatsAppPage from "./pages/WhatsAppPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import VoiceRecordingPage from "./pages/VoiceRecordingPage";
import AnalyzeProductImagePage from "./pages/AnalyzeProductImagePage";
import ArtisanHubPage from "./pages/ArtisanHubPage";
import SmartProductEnhancerPage from "./pages/SmartProductEnhancerPage";
import QuotationResultPage from "./pages/QuotationResultPage";
import InstagramReviewPostPage from "./pages/InstagramReviewPostPage";
import WhatsAppSendPage from "./pages/WhatsAppSendPage";
import ShopifyLaunchPage from "./pages/ShopifyLaunchPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/whatsapp" element={<WhatsAppPage />} />
          <Route path="/instagram" element={<ComingSoonPage />} />
          <Route path="/website" element={<ComingSoonPage />} />
          <Route path="/voice-recording" element={<VoiceRecordingPage />} />
          <Route path="/analyze-image" element={<AnalyzeProductImagePage />} />
          <Route path="/hub" element={<ArtisanHubPage />} />
          <Route path="/enhancer" element={<SmartProductEnhancerPage />} />
          <Route path="/quotation" element={<QuotationResultPage />} />
          <Route path="/instagram-post" element={<InstagramReviewPostPage />} />
          <Route path="/whatsapp-send" element={<WhatsAppSendPage />} />
          <Route path="/shopify-launch" element={<ShopifyLaunchPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;