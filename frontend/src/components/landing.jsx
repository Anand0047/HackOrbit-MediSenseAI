import React, { useState } from "react";
import Find from "./find.jsx";
import Chat from "./chat.jsx";

const Landing = () => {
  const [activeComponent, setActiveComponent] = useState("chat"); 

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
        <button 
          className={`px-8 py-3 ${activeComponent === 'chat' ? 'bg-white/40' : 'bg-white/20'} backdrop-blur-md border border-black/30 hover:bg-white/30 text-black font-medium shadow-lg transition duration-200`}
          onClick={() => setActiveComponent('chat')}
        >
          AI Health Consultant
        </button>
        
        <button 
          className={`px-8 py-3 ${activeComponent === 'find' ? 'bg-white/40' : 'bg-white/20'} backdrop-blur-md border border-black/30 hover:bg-white/30 text-black font-medium shadow-lg transition duration-200`}
          onClick={() => setActiveComponent('find')}
        >
          Find my druggist
        </button>

        <button 
          className={`px-8 py-3 ${activeComponent === 'health' ? 'bg-white/40' : 'bg-white/20'} backdrop-blur-md border border-black/30 hover:bg-white/30 text-black font-medium shadow-lg transition duration-200`}
          onClick={() => setActiveComponent('health')}
        >
          Health records
        </button>
        
        <button 
          className={`px-8 py-3 ${activeComponent === 'blog' ? 'bg-white/40' : 'bg-white/20'} backdrop-blur-md border border-black/30 hover:bg-white/30 text-black font-medium shadow-lg transition duration-200`}
          onClick={() => setActiveComponent('blog')}
        >
          Blog
        </button>
      </div>

      {/* Container for active component */}
      <div className="mx-[10%] mb-16">
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-gray-200">
          {activeComponent === 'chat' && <Chat />}
          {activeComponent === 'find' && <Find />}
          {activeComponent === 'health' && (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold mb-2">Health Records</h3>
              <p className="text-gray-600">This feature is coming soon</p>
            </div>
          )}
          {activeComponent === 'blog' && (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold mb-2">Blog</h3>
              <p className="text-gray-600">This feature is coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;