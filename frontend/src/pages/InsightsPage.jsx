import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const InsightsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transcript, analysis } = location.state || { transcript: "", analysis: null };

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-text-primary">No Analysis Data</h1>
          <p className="mt-2 text-text-secondary">Please go back and record your business description first.</p>
          <button onClick={() => navigate("/")} className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-white font-semibold hover:bg-primary-hover">Go Home</button>
        </div>
      </div>
    );
  }

  const { businessType, detectedFocus, recommendedSolutions } = analysis;
  const allSolutionIds = ["whatsapp", "instagram", "website"];
  const primaryId = recommendedSolutions.primary.id;
  const secondaryId = recommendedSolutions.secondary.id;
  const thirdSolutionId = allSolutionIds.find((id) => id !== primaryId && id !== secondaryId);
  const thirdSolution = { id: thirdSolutionId, reason: `Explore ${thirdSolutionId} to expand your reach.` };

  const cards = [
    { id: recommendedSolutions.primary.id, title: "WhatsApp Business Setup", color: "green", reason: recommendedSolutions.primary.reason, icon: "svg-whatsapp" },
    { id: recommendedSolutions.secondary.id, title: "Instagram Marketing Strategy", color: "pink", reason: recommendedSolutions.secondary.reason, icon: "svg-instagram" },
    { id: thirdSolution.id, title: "Professional Website", color: "blue", reason: thirdSolution.reason, icon: "svg-website" },
  ];

  const Icon = ({ name, className }) => {
    if (name === "svg-website") return (
      <span className={`material-symbols-outlined ${className}`}>language</span>
    );
    if (name === "svg-instagram") return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.2,5.2 0,0 1,16.2 22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.2,5.2 0,0 1,7.8 2M7.6,4A3.6,3.6 0,0 0,4 7.6V16.4A3.6,3.6 0,0 0,7.6 20H16.4A3.6,3.6 0,0 0,20 16.4V7.6A3.6,3.6 0,0 0,16.4 4H7.6M17.25,5.5A1.25,1.25 0,0 1,18.5 6.75A1.25,1.25 0,0 1,17.25 8A1.25,1.25 0,0 1,16 6.75A1.25,1.25 0,0 1,17.25 5.5M12,7A5,5 0,0 1,17 12A5,5 0,0 1,12 17A5,5 0,0 1,7 12A5,5 0,0 1,12 7M12,9A3,3 0,0 0,9 12A3,3 0,0 0,12 15A3,3 0,0 0,15 12A3,3 0,0 0,12 9Z"/></svg>
    );
    // whatsapp-like chat bubble
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.52 3.48 1.45 4.93l-1.5 5.46 5.59-1.46c1.4.88 3.01 1.4 4.7 1.4h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z"/></svg>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f7f6] text-text-primary">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white"><span className="material-symbols-outlined text-base">auto_awesome</span></div>
          <h2 className="text-lg font-bold">Artisan AI</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-text-primary hover:bg-gray-100"><span className="material-symbols-outlined">notifications</span></button>
          <div className="size-10 rounded-full bg-gray-300"/>
        </div>
      </header>

      {/* Title */}
      <div className="my-8 px-4 text-center sm:my-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">Tailored Business Growth Suggestions</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-gray-600">Here are some personalized suggestions to grow your artisan business. We've analyzed your profile to provide the best next steps for your creative journey.</p>
      </div>

      {/* Summary */}
      <div className="mx-auto mb-6 max-w-5xl rounded-xl border border-border-color bg-white p-4 sm:p-6 text-sm text-text-secondary">
        <span className="mr-4"><strong>Business Type:</strong> {businessType}</span>
        <span><strong>Detected Focus:</strong> {detectedFocus}</span>
      </div>

      {/* Grid */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {cards.map(({ id, title, color, reason, icon }) => (
          <div key={id} className="flex w-full flex-col items-center gap-4 rounded-xl bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-lg sm:p-8">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-${color}-100`}>
              <Icon name={icon} className={`h-8 w-8 text-${color}-600`} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
            <p className="flex-grow max-w-md text-base leading-relaxed text-gray-600">{reason}</p>
            <Link to={`/${id}`} state={{ analysis, transcript }} className="mt-4 flex h-11 w-full max-w-xs items-center justify-center rounded-lg bg-primary px-4 text-base font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <span className="truncate">{id === "whatsapp" ? "Start Business" : "View Plan"}</span>
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
};

export default InsightsPage;
