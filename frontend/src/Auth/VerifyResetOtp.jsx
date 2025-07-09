import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthHeader from "./component/AuthHeader";
import OtpSection from "./component/otp/OtpSection";
import AuthCard from "./component/AuthCard";
import { Toast, showErrorToast } from "../components/Toast";

export default function VerifyResetOtp() {
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  useEffect(() => {
    if (!email) {
      showErrorToast("No email found. Please restart password reset");
      setTimeout(() => navigate("/forgot-password"), 1500);
    }
  }, [email, navigate]);

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
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <AuthHeader />

        {/* Card */}
        <AuthCard 
          title="Verify OTP" 
          subtitle="Enter the 6-digit code sent to your email"
        >
          <OtpSection 
            email={email} 
            flow="reset" 
            onVerified={() => {
              setTimeout(() => navigate("/reset-password"), 1000);
            }} 
          />
        </AuthCard>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          Remember your password?{" "}
          <motion.a
            href="/login"
            className="text-blue-600 hover:text-blue-800 hover:underline transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to login
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}