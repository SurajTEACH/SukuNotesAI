import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function BackButton({ label = "Back", fallbackTo = "/" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackTo);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="group inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-95 backdrop-blur-md"
      title="Go back"
      type="button"
    >
      <ArrowLeft className="h-4 w-4 text-gray-400 group-hover:text-white transition-transform duration-200 group-hover:-translate-x-1" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default BackButton;

