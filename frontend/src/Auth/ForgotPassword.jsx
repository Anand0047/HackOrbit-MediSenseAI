import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Input from "./component/Input";
import AuthHeader from "./component/AuthHeader";
import SubmitButton from "./component/SubmitButton";
import AuthCard from "./component/AuthCard";
import authFetch from "../util/authFetch";
import { Toast, showSuccessToast, showErrorToast } from "../components/Toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email.trim()) {
      setError("Email is required");
      setIsSubmitting(false);
      showErrorToast("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      setIsSubmitting(false);
      showErrorToast("Please enter a valid email address");
      return;
    }

    setError("");

    try {
      const res = await authFetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res) {
        setIsSubmitting(false);
        showErrorToast("Connection error. Please try again");
        return;
      }

      const msg = await res.text();

      if (res.ok) {
        showSuccessToast("Password reset code sent to your email");
        localStorage.setItem("resetEmail", email);
        setTimeout(() => navigate("/verify-reset-otp"), 1500);
      } else {
        showErrorToast(msg || "Failed to send reset code");
      }
    } catch (err) {
      showErrorToast("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4"
    >
      {/* Toast Notifications */}
      <Toast />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full max-w-md"
      >
        <AuthHeader />

        <AuthCard title="Reset Password" subtitle="Enter your email to receive a reset code">
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
                whileHover={{ color: "#1d4ed8" }}
                transition={{ duration: 0.2 }}
              >
                Email Address
              </motion.label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="your@email.com"
                error={error}
              />
            </motion.div>

            <SubmitButton 
              name={isSubmitting ? "Sending..." : "Send Reset Code"} 
              disabled={isSubmitting} 
            />
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-gray-500 mt-4"
          >
            Remember your password?{" "}
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Login here
              </Link>
            </motion.div>
          </motion.div>
        </AuthCard>
      </motion.div>

      {/* Loading overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}