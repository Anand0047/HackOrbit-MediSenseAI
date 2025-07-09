import { motion } from "framer-motion";
import { GiStethoscope } from "react-icons/gi";

export default function AuthHeader() {
  return (
    <motion.div 
      className="text-center mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="inline-flex flex-col items-center">
        {/* Modern icon container with subtle shadow */}
        <motion.div 
          className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-white shadow-sm border border-blue-50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: 0.2,
            type: "spring", 
            stiffness: 400 
          }}
        >
          <GiStethoscope className="w-8 h-8 text-blue-600" />
        </motion.div>

        {/* Title with refined gradient */}
        <motion.h1 
          className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          MediSense
        </motion.h1>

        {/* Subtitle with modern underline */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.p
            className="text-blue-800/90 text-sm font-medium tracking-wider"
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Your trusted healthcare companion
          </motion.p>
          
          <motion.div 
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-blue-500 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ 
              delay: 0.8, 
              duration: 0.5,
              type: "spring",
              stiffness: 300
            }}
          />
        </motion.div>

        {/* Decorative dots (subtle modern touch) */}
        <motion.div 
          className="flex mt-6 space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-300"
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}