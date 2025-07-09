import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldAlt } from "react-icons/fa";

export default function OtpInput({ length = 6, value, onChange }) {
  const inputRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val) return;

    const otpArray = [...value];
    otpArray[i] = val;
    onChange(otpArray);

    if (i < length - 1) {
      inputRefs.current[i + 1]?.focus();
      setActiveIndex(i + 1);
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      const otpArray = [...value];
      otpArray[i] = "";
      onChange(otpArray);

      if (i > 0 && !value[i]) {
        inputRefs.current[i - 1]?.focus();
        setActiveIndex(i - 1);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-blue-600">
        <FaShieldAlt className="text-2xl" />
      </div>
      
      <div className="flex justify-center gap-3">
        {Array.from({ length }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.95, opacity: 0.9 }}
            animate={{ 
              scale: 1,
              opacity: 1,
              boxShadow: activeIndex === i 
                ? "0 0 0 2px rgba(20, 184, 166, 0.5)" 
                : value[i] 
                  ? "0 0 0 1px rgba(5, 150, 105, 0.3)"
                  : "0 0 0 1px rgba(209, 213, 219, 0.5)"
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="relative"
          >
            <input
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`
                w-14 h-14 text-center rounded-lg text-2xl font-bold font-mono 
                bg-white border-none focus:outline-none focus:ring-0
                ${value[i] ? "text-gray-800" : "text-gray-400"}
                shadow-sm
              `}
              value={value[i] || ""}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onFocus={() => setActiveIndex(i)}
            />
            
            <AnimatePresence>
              {activeIndex === i && (
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    boxShadow: "0 0 0 2px rgba(20, 184, 166, 0.5)"
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      
      <motion.p 
        className="mt-3 text-xs text-gray-500"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Enter your 6-digit security code
      </motion.p>
    </div>
  );
}