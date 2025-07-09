import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaHospital, FaHeartbeat } from "react-icons/fa";

export default function Input({
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  icon = "default" // 'default', 'email', 'password', 'phone', 'hospital'
}) {
  const [isFocused, setIsFocused] = useState(false);

  // Get appropriate icon based on input type
  const getIcon = () => {
    switch(icon) {
      case 'password':
        return <FaLock className="w-4 h-4 text-blue-600" />;
      case 'email':
        return <FaEnvelope className="w-4 h-4 text-blue-600" />;
      case 'phone':
        return <FaPhone className="w-4 h-4 text-blue-600" />;
      case 'hospital':
        return <FaHospital className="w-4 h-4 text-blue-600" />;
      default:
        return <FaUser className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="w-full">
      <motion.div
        className="relative"
        whileHover={{ y: -1 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {/* Medical-themed input field with blue focus */}
        <motion.input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-sm outline-none transition-all placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          animate={{
            boxShadow: isFocused
              ? "0 0 0 3px rgba(59, 130, 246, 0.2)"
              : "none",
            borderColor: isFocused ? "#3b82f6" : "#e5e7eb",
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Medical icon with pulse animation when focused */}
        <motion.div 
          className="absolute left-3 top-3.5"
          animate={{
            scale: isFocused ? 1.1 : 1,
            color: isFocused ? "#2563eb" : "#3b82f6"
          }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {getIcon()}
        </motion.div>

        {/* Medical activity indicator for passwords */}
        {type === "password" && (
          <AnimatePresence>
            {value && (
              <motion.div
                className="absolute right-3 top-3 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {value.length > 0 && (
                  <motion.div
                    className="flex space-x-1"
                    animate={{
                      scale: isFocused ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className={`h-1 w-1 rounded-full ${
                          value.length >= i*3 ? "bg-blue-500" : "bg-gray-300"
                        }`}
                        animate={{
                          scale: isFocused ? [1, 1.3, 1] : 1,
                          opacity: isFocused ? [0.6, 1, 0.6] : 1,
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: isFocused ? Infinity : 0,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}