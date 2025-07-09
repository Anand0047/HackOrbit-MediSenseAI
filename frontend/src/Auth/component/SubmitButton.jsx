import { motion } from "framer-motion";

export default function SubmitButton({
  name = "Submit",
  type = "submit",
  onClick,
  disabled = false,
  className = "",
  loading = false,
  success = false,
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white 
        font-medium py-2.5 sm:py-3.5 px-4 rounded-lg shadow-md relative 
        overflow-hidden disabled:opacity-80 disabled:cursor-not-allowed ${className}`}
      whileHover={(!disabled && !loading) ? {
        scale: 1.02,
        background: ["linear-gradient(to right, #2563eb, #1d4ed8)", "linear-gradient(to right, #1d4ed8, #1e40af)"],
        boxShadow: "0 4px 15px -3px rgba(29, 78, 216, 0.4)"
      } : {}}
      whileTap={(!disabled && !loading) ? { scale: 0.98 } : {}}
      animate={
        success ? {
          background: ["linear-gradient(to right, #16a34a, #15803d)"],
          transition: { duration: 0.3 }
        } : {}
      }
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15,
        duration: 0.15
      }}
    >
      {/* Loading spinner */}
      <motion.div
        className="absolute left-4 top-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: loading ? 1 : 0,
          scale: loading ? 1 : 0.5
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Success checkmark */}
      <motion.div
        className="absolute left-4 top-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: success ? 1 : 0,
          scale: success ? 1 : 0.5
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: success ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-4 h-4"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <motion.path
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: success ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
          </svg>
        </motion.div>
      </motion.div>

      <motion.span 
        className="relative z-10 text-sm sm:text-base flex items-center justify-center gap-2"
        initial={false}
        animate={{
          x: disabled ? [0, 2, -2, 0] : 0,
          opacity: (loading || success) ? 0.8 : 1
        }}
        transition={{
          duration: 0.4,
          repeat: disabled ? Infinity : 0
        }}
      >
        {loading ? "Processing..." : success ? "Success!" : name}
      </motion.span>

      {/* Animated background elements */}
      <motion.span
        className="absolute inset-0 bg-white opacity-0"
        whileHover={(!disabled && !loading) ? { opacity: 0.1 } : {}}
        transition={{ duration: 0.3 }}
      />
      
      {/* Ripple effect */}
      <motion.span
        className="absolute inset-0 bg-white opacity-0 rounded-lg"
        whileTap={(!disabled && !loading) ? {
          opacity: [0, 0.2, 0],
          scale: 2
        } : {}}
        transition={{ duration: 0.6 }}
      />

      {/* Progress bar for loading state */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-blue-400"
        initial={{ width: 0 }}
        animate={{
          width: loading ? "100%" : 0,
          opacity: loading ? 1 : 0
        }}
        transition={{
          duration: 2,
          repeat: loading ? Infinity : 0,
          ease: "linear"
        }}
      />
    </motion.button>
  );
}