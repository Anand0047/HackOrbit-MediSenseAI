// components/Layout.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Pill, Stethoscope, HeartPulse, BookOpen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import logo from "../img/LOGO-removebg-preview.png";

<img
  src={logo}
  alt="MediSense AI Logo"
  className="h-10 w-10 mr-2 object-contain"
/>


const categories = [
  { name: 'Medicine', icon: <Pill className="h-4 w-4 mr-2" />, searchTerm: 'medical treatments' },
  { name: 'Treatment', icon: <Stethoscope className="h-4 w-4 mr-2" />, searchTerm: 'medical procedures' },
  // ... other categories (same as in BlogPage.jsx)
];

export default function Layout({ children, showHealthTopics = false }) {
  return (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="min-h-screen p-6 relative z-10 relative z-10  bg-opacity-85" // Added relative and z-10
  style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }} // Semi-transparent white background
>
      {/* Header */}
      <motion.header 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-between  bg-breathing items-center mb-8"
      >
<div className="flex items-center">
<img
  src={logo}
  alt="MediSense AI Logo"
  className="h-16 w-16 mr-2 object-contain"
/>
  <Link
    to="/"
    className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
  >
    MediSense AI
  </Link>
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
        className="flex justify-center gap-6 mb-8 "
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/find"
            className="flex items-center justify-center px-6 py-3 bg-white border-2 border-blue-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:bg-blue-50"
          >
            <Pill className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-gray-700 font-medium">Find My Druggist</span>
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button 
            className="flex items-center justify-center px-6 py-3 bg-white border-2 border-blue-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:bg-blue-50"
          >
            <HeartPulse className="h-5 w-5 text-pink-600 mr-2" />
            <span className="text-gray-700 font-medium">Health Records</span>
          </button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/blog"
            className="flex items-center justify-center px-6 py-3 bg-white border-2 border-blue-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:bg-blue-50"
          >
            <BookOpen className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-gray-700 font-medium">Blog</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Health Topics Section */}
      {showHealthTopics && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12  bg-breathing"
        >
          {/* Optional health categories UI */}
        </motion.div>
      )}

      {/* Page Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: showHealthTopics ? 0.3 : 0.2 }}
      >
        {children}

        {/* Newsletter Section with Blue Background */}
        <div className="max-w-4xl mx-auto mt-20 px-6 py-12  bg-breathing bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Stay Updated with Medical Knowledge
          </h2>
          <p className="text-lg mb-6">
            Subscribe to our newsletter for the latest health information and research updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="py-6 rounded-xl border-0 bg-white/20 text-white placeholder:text-blue-100 focus:bg-white/30 focus:ring-2 focus:ring-white/50"
            />
            <Button 
              className="py-6 rounded-xl bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium shadow-lg"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}