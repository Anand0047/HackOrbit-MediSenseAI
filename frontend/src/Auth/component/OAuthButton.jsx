import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin, FaGithub, FaMicrosoft } from "react-icons/fa";

const providerInfo = {
  google: {
    label: "Continue with Google",
    icon: <FcGoogle size={24} />,
    bg: "bg-white text-gray-800 hover:bg-gray-50",
    border: "border border-gray-200",
    url: "http://localhost:8080/oauth2/authorization/google",
    whileHover: { 
      y: -3,
      boxShadow: "0 6px 20px -4px rgba(66, 133, 244, 0.25)"
    }
  },
  linkedin: {
    label: "Continue with LinkedIn",
    icon: <FaLinkedin size={24} className="text-[#0077B5]" />,
    bg: "bg-white text-gray-800 hover:bg-gray-50",
    border: "border border-gray-200",
    url: "http://localhost:8080/oauth2/authorization/linkedin",
    whileHover: { 
      y: -3,
      boxShadow: "0 6px 20px -4px rgba(0, 119, 181, 0.25)"
    }
  },
  github: {
    label: "Continue with GitHub",
    icon: <FaGithub size={24} className="text-gray-800" />,
    bg: "bg-white text-gray-800 hover:bg-gray-50",
    border: "border border-gray-200",
    url: "http://localhost:8080/oauth2/authorization/github",
    whileHover: { 
      y: -3,
      boxShadow: "0 6px 20px -4px rgba(36, 41, 46, 0.25)"
    }
  },
  microsoft: {
    label: "Continue with Microsoft",
    icon: <FaMicrosoft size={24} className="text-[#0078D4]" />,
    bg: "bg-white text-gray-800 hover:bg-gray-50",
    border: "border border-gray-200",
    url: "http://localhost:8080/oauth2/authorization/microsoft",
    whileHover: { 
      y: -3,
      boxShadow: "0 6px 20px -4px rgba(0, 120, 212, 0.25)"
    }
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  tap: {
    scale: 0.96,
    transition: {
      duration: 0.15
    }
  }
};

const iconVariants = {
  idle: { 
    scale: 1,
    rotate: 0
  },
  hover: {
    scale: 1.15,
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut"
    }
  }
};

export default function OAuthButton({ provider, index }) {
  const info = providerInfo[provider];

  if (!info) return null;

  const handleClick = () => {
    // Add click animation before navigation
    document.getElementById(`oauth-btn-${provider}`).style.transform = "scale(0.98)";
    setTimeout(() => {
      window.location.href = info.url;
    }, 150);
  };

  return (
    <motion.button
      id={`oauth-btn-${provider}`}
      onClick={handleClick}
      className={`w-full flex items-center justify-center space-x-3 rounded-xl py-3.5 px-6 transition-all duration-300 ${info.bg} ${info.border} relative overflow-hidden`}
      variants={buttonVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      transition={{
        duration: 0.4,
        delay: index * 0.07,
        ease: "easeOut"
      }}
    >
      {/* Animated background on hover */}
      <motion.span 
        className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 opacity-0"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1, x: "100%" }}
        transition={{ duration: 0.8, ease: "linear" }}
      />
      
      {/* Centered icon with animation */}
      <motion.span
        variants={iconVariants}
        className="flex-shrink-0"
        initial="idle"
        whileHover="hover"
      >
        {info.icon}
      </motion.span>
      
      {/* Centered text */}
      <span className="text-sm font-medium flex-grow text-center">
        {info.label}
      </span>
      
      {/* Animated arrow - only shows on hover */}
      <motion.span
        className="flex-shrink-0"
        initial={{ x: -10, opacity: 0 }}
        whileHover={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-gray-400"
        >
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </motion.span>
    </motion.button>
  );
}