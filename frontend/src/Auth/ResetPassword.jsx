import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthHeader from "./component/AuthHeader";
import PasswordInput from "./component/password/PasswordInput";
import PasswordRequirements from "./component/password/PasswordRequirement";
import SubmitButton from "./component/SubmitButton";
import PasswordStrengthBar from "./component/password/PasswordStrengthBar";
import AuthCard from "./component/AuthCard";
import authFetch from "../util/authFetch";
import { Toast, showSuccessToast, showErrorToast } from "../components/Toast";

export default function ResetPassword() {
  const email = localStorage.getItem("resetEmail");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [checks, setChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    digit: false,
    special: false,
    confirm: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const p = form.password;
    setChecks({
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      digit: /\d/.test(p),
      special: /[^A-Za-z0-9]/.test(p),
      confirm: p === form.confirmPassword && p.length > 0,
    });
  }, [form.password, form.confirmPassword]);

  const handleReset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email) {
      showErrorToast("Email not found. Please restart password reset");
      setIsSubmitting(false);
      return navigate("/forgot-password");
    }

    if (!Object.values(checks).every(Boolean)) {
      showErrorToast("Please meet all password requirements");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await authFetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      if (!res) {
        setIsSubmitting(false);
        showErrorToast("Connection error. Please try again");
        return;
      }

      const data = await res.json();

      if (res.ok) {
        showSuccessToast("Password reset successfully! Redirecting to login...");
        localStorage.removeItem("resetEmail");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showErrorToast(data.message || "Password reset failed");
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
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <AuthHeader />

        {/* Card */}
        <AuthCard 
          title="Reset Password" 
          subtitle="Create a strong new password to secure your account"
        >
          <form onSubmit={handleReset} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <PasswordInput
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="New Password"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <PasswordInput
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm New Password"
                required
              />
            </motion.div>

            {/* Password Strength Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <PasswordStrengthBar checks={checks} />
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <PasswordRequirements checks={checks} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <SubmitButton 
                name={isSubmitting ? "Resetting..." : "Reset Password"} 
                disabled={isSubmitting}
              />
            </motion.div>
          </form>
        </AuthCard>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          Remembered your password?{" "}
          <motion.a
            href="/login"
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to login
          </motion.a>
        </motion.div>
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