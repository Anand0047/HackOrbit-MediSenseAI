import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaShieldAlt } from "react-icons/fa";

const rules = {
  length: "Minimum 8 characters",
  upper: "At least 1 uppercase letter",
  lower: "At least 1 lowercase letter",
  digit: "At least 1 number",
  special: "At least 1 special character",
  confirm: "Passwords match exactly",
};

export default function PasswordRequirements({ checks }) {
  return (
    <motion.div 
      className="bg-blue-50 rounded-lg p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-3">
        <FaShieldAlt className="text-blue-600 mr-2" />
        <h3 className="text-sm font-semibold text-blue-800">
          Password Security Requirements
        </h3>
      </div>
      
      <motion.ul 
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {Object.entries(rules).map(([key, label]) => (
          <motion.li 
            key={key}
            className="flex items-start"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.3,
              delay: 0.05 * Object.keys(rules).indexOf(key)
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={checks[key] ? "valid" : "invalid"}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaCheckCircle
                  className={`mt-0.5 mr-2 flex-shrink-0 ${
                    checks[key] ? "text-teal-500" : "text-gray-300"
                  }`}
                />
              </motion.span>
            </AnimatePresence>

            <motion.span
              className={`text-sm ${
                checks[key] ? "text-gray-800" : "text-gray-500"
              }`}
              animate={{
                color: checks[key] ? "#1f2937" : "#6b7280",
              }}
            >
              {label}
            </motion.span>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div 
        className="mt-3 pt-3 border-t border-blue-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs text-blue-600">
          <strong>Note:</strong> For patient safety, all passwords must meet these security standards.
        </p>
      </motion.div>
    </motion.div>
  );
}