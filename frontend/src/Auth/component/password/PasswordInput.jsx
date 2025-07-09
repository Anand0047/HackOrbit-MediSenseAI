import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash, FaShieldAlt, FaHeartbeat } from "react-icons/fa";

export default function PasswordInput({
  name,
  value,
  onChange,
  placeholder = "Enter your password",
  error = "",
  required = false,
}) {
  const [show, setShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const disableAction = (e) => e.preventDefault();

  return (
    <div className="relative w-full">
      <motion.div
        className={`relative border-2 rounded-lg bg-white ${
          error ? "border-red-400" : "border-gray-200"
        }`}
        whileHover={{ y: -1 }}
        animate={{
          boxShadow: isFocused
            ? "0 0 0 3px rgba(59, 130, 246, 0.2)"
            : "none",
          borderColor: error
            ? "#f87171"
            : isFocused
            ? "#3b82f6"  // Changed to blue-500
            : "#e5e7eb",
        }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {/* Medical-themed shield icon with pulse animation */}
        <motion.div 
          className="absolute left-3 top-3"
          animate={{
            color: isFocused ? "#2563eb" : "#3b82f6",
            scale: isFocused ? 1.1 : 1
          }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <FaShieldAlt className="w-4 h-4" />
        </motion.div>

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 pl-10 bg-transparent text-sm outline-none pr-10 placeholder-gray-400 focus:border-blue-500"
          onCopy={disableAction}
          onPaste={disableAction}
          onCut={disableAction}
          onContextMenu={disableAction}
          autoComplete="new-password"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Password toggle button with improved animation */}
        <motion.button
          type="button"
          className="absolute right-3 top-3 text-gray-400 hover:text-blue-600"
          onClick={() => setShow((prev) => !prev)}
          tabIndex={-1}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={show ? "show" : "hide"}
              initial={{ opacity: 0, rotate: -15 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 15 }}
              transition={{ duration: 0.15 }}
            >
              {show ? (
                <FaEyeSlash className="w-4 h-4" />
              ) : (
                <FaEye className="w-4 h-4" />
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* Password strength indicator (medical pulse theme) */}
        {value && (
          <motion.div 
            className="absolute -bottom-1.5 left-0 h-0.5 bg-blue-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${Math.min(100, value.length * 10)}%`,
              backgroundColor: value.length > 8 ? "#3b82f6" : value.length > 5 ? "#60a5fa" : "#93c5fd"
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>

      {/* Error message with medical alert icon */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-xs text-red-500 mt-1 flex items-start"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}