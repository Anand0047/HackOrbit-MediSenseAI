import React, { useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import Find from "./find.jsx";
import Chat from "./chat.jsx";
import Blog from "./BlogPage.jsx";
import { Link } from "react-router-dom";
import { Pill, HeartPulse, BookOpen } from "lucide-react";

const Landing = () => {
  const [activeComponent, setActiveComponent] = useState("chat"); 

  return (
    <motion.div // Wrap entire page with motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-6"
    >
      {/* Header with logo and login button */}
      <motion.header 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-between items-center mb-8"
      >
        <div className="flex items-center">
          <Pill className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">MediSense AI</h1>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium rounded-full shadow-md transition duration-200"
        >
          Login
        </motion.button>
      </motion.header>

      {/* Capsule-shaped navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center gap-6 mb-8"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/find"
            className="flex items-center justify-center px-6 py-3 bg-white border-2 border-blue-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:bg-blue-50"
            onClick={() => setActiveComponent('find')}
          >
            <Pill className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-gray-700 font-medium">Find My Druggist</span>
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button 
            className="flex items-center justify-center px-6 py-3 bg-white border-2 border-blue-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:bg-blue-50"
            onClick={() => setActiveComponent('health')}
          >
            <HeartPulse className="h-5 w-5 text-pink-600 mr-2" />
            <span className="text-gray-700 font-medium">Health Records</span>
          </button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/blog"
            className="flex items-center justify-center px-6 py-3 bg-white border-2 border-blue-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:bg-blue-50"
            onClick={() => setActiveComponent('blog')}
          >
            <BookOpen className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-gray-700 font-medium">Blog</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Chat component with fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mx-auto max-w-4xl"
      >
        <Chat />
      </motion.div>
    </motion.div>
  );
};

export default Landing;