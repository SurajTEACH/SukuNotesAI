import React, { useState } from "react";
import InterviewStep1SetUp from "../components/InterviewStep1SetUp";
import InterviewStep2SetUp from "../components/InterviewStep2SetUp";
import InterviewStep3Report from "../components/InterviewStep3Report";
import Navbar from "../components/Navbar.jsx";

function InterviewPage() {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);

  return (
    // ✅ Page fixed height, body scroll off
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* ✅ Column layout */}
      <div className="flex flex-col h-full">
        {/* ✅ Navbar stays in place */}
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>

        {/* ✅ ONLY this area scrolls (Navbar ke niche) */}
        <div className="flex-1 overflow-y-auto scroll-area">
          {step === 1 && (
            <InterviewStep1SetUp
              onStart={(data) => {
                setInterviewData(data);
                setStep(2);
              }}
            />
          )}

          {step === 2 && (
            <InterviewStep2SetUp
              interviewData={interviewData}
              onFinish={(report) => {
                setInterviewData(report);
                setStep(3); // ✅ (aapke code me 2 tha, wo mistake hai)
              }}
            />
          )}

          {step === 3 && <InterviewStep3Report report={interviewData} />}
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;
