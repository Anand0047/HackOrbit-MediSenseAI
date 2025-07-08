import React, { useState } from "react";
import Find from "./find.jsx"; // Import your Find component

const Landing = () => {
  const [showFind, setShowFind] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with logo and login button */}
      <header className="flex justify-between items-center mb-16">
        <h1 className="text-3xl font-bold text-gray-800">MediSense AI</h1>
        <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition duration-200">
          login
        </button>
      </header>

      {/* Horizontal button group with glass effect */}
      <div className="flex justify-center gap-4 mb-16">
        <button className="px-8 py-3 bg-white/20 backdrop-blur-md border border-black/30 hover:bg-white/30 text-black font-medium shadow-lg transition duration-200">
          AI Health Consultant
        </button>
        
        <button 
          className="px-8 py-3 bg-white/20 backdrop-blur-md border border-black/30 hover:bg-white/30 text-black font-medium shadow-lg transition duration-200"
          onClick={() => setShowFind(!showFind)}
        >
          Find my druggist
        </button>

        <button className="px-8 py-3 bg-white/20 backdrop-blur-md border border-black/30 hover:bg-white/30 text-black font-medium shadow-lg transition duration-200">
          Health records
        </button>
        
        <button className="px-8 py-3 bg-white/20 backdrop-blur-md border border-black/30 hover:bg-white/30 text-black font-medium shadow-lg transition duration-200">
          Blog
        </button>
      </div>

      {/* Container for Find component */}
      {showFind && (
        <div className="mx-[10%] mb-16"> {/* 10% margin on left and right */}
          <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-gray-200">
            <Find />
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;