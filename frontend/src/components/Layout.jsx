import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Pill, Stethoscope, HeartPulse, BookOpen, LogOut, User } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import logo from "../img/LOGO-removebg-preview.png";
import { useEffect, useState } from "react";
import { showSuccessToast } from "./Toast";
import { jwtDecode } from "jwt-decode";

export default function Layout({ children, showHealthTopics = false }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setIsLoggedIn(true);
          setUserName(decoded.name || "User");
        } catch (error) {
          console.error("Invalid token:", error);
          handleLogout();
        }
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    };

    checkAuthState();

    // Listen for auth changes in other tabs
    window.addEventListener("storage", checkAuthState);
    return () => window.removeEventListener("storage", checkAuthState);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
    showSuccessToast("Logged out successfully");
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-6 relative z-10 bg-opacity-85"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
    >
      {/* Header */}
      <motion.header 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-between items-center mb-8"
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

        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <motion.div 
              className="hidden md:flex items-center gap-2 text-sm text-gray-600"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <User className="h-4 w-4" />
              <span>{userName}</span>
            </motion.div>
          )}
          
          {isLoggedIn ? (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-full shadow-md transition duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium rounded-full shadow-md transition duration-200"
            >
              Login
            </motion.button>
          )}
        </div>
      </motion.header>

      {/* Navigation Buttons */}
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
          >
            <Pill className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-gray-700 font-medium">Find My Druggist</span>
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {/* <button 
            className="flex items-center justify-center px-6 py-3 bg-white border-2 border-blue-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:bg-blue-50"
          >
            <HeartPulse className="h-5 w-5 text-pink-600 mr-2" />
            <span className="text-gray-700 font-medium">Health Records</span>
          </button> */}
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
          className="mb-12"
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

        {/* Newsletter Section */}
        <div className="max-w-4xl mx-auto mt-20 px-6 py-12 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl shadow-lg text-center">
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