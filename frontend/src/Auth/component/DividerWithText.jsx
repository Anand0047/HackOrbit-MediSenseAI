import { motion } from "framer-motion";

export default function DividerWithText({ text = "OR" }) {
  return (
    <motion.div 
      className="relative my-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="absolute inset-0 flex items-center"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="w-full border-t border-gray-200" />
      </motion.div>
      
      <motion.div
        className="relative flex justify-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.4 }}
      >
        <motion.span 
          className="px-3 bg-white text-sm font-medium text-gray-500 rounded-full border border-gray-200"
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.9)"
          }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {text}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}