import { motion } from "framer-motion";
import { GiStethoscope } from "react-icons/gi";

export default function AuthCard({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 w-full max-w-md"
    >
      {/* Modern medical header with improved gradient */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 py-6 px-6 relative">
        {/* Subtle medical pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xOSAxNGMxLjQ5LTEuNDkgMi43NC0yLjY3IDMuNTEtMy42M0EyLjg1IDIuODUgMCAwMDIyIDguMjNhMi44MyAyLjgzIDAgMDAtLjQ5LTEuNTdjLS44Ny0uOTYtMi4wMi0yLjEyLTMuNTEtMy42QTEwLjg1IDEwLjg1IDAgMDAxMiAyYTEwLjg1IDEwLjg1IDAgMDAtNiAydjBsLS43NS43NUEyLjgzIDIuODMgMCAwMDIgNC4yM2EyLjg1IDIuODUgMCAwMC0uNDkgMS41N2MuODcuOTYgMi4wMiAyLjEyIDMuNTEgMy42QTEwLjg1IDEwLjg1IDAgMDAyIDEyYTEwLjg1IDEwLjg1IDAgMDAyIDZjMS40OSAxLjQ5IDIuNzQgMi42NyAzLjUxIDMuNjNhMi44NSAyLjg1IDAgMDAxLjQ5LjQ5IDIuODMgMi44MyAwIDAwMS41Ny0uNDljLjg3LS45NiAyLjAyLTIuMTIgMy41MS0zLjZBMTEuMTQgMTEuMTQgMCAwMDIyIDEyYzAtMi0uNjctNC02LTZ6Ii8+PC9zdmc+')]"></div>
        </div>
        
        {/* Modern medical header content */}
        <div className="relative space-y-2">
          <motion.div 
            className="flex items-center justify-center mb-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm border border-white/10">
              <GiStethoscope className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          <motion.h2 
            className="text-2xl font-bold text-white text-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {title}
          </motion.h2>
          
          {subtitle && (
            <motion.p
              className="text-blue-100/90 text-sm text-center font-medium tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>

      {/* Modern content area with improved spacing */}
      <div className="p-8 space-y-6 bg-white">
        <div className="relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          {children}
        </div>
      </div>
    </motion.div>
  );
}