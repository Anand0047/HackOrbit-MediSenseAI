import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import authFetch from "../../util/authFetch";
import { showErrorToast, showSuccessToast, Toast } from "../../components/Toast";
import AuthHeader from "../component/AuthHeader";
import AuthCard from "../component/AuthCard";
import Input from "../component/Input";
import PasswordInput from "../component/password/PasswordInput";
import PasswordStrengthBar from "../component/password/PasswordStrengthBar";
import PasswordRequirements from "../component/password/PasswordRequirement";
import SubmitButton from "../component/SubmitButton";
import DividerWithText from "../component/DividerWithText";
import OAuthButton from "../component/OAuthButton";
import OtpSection from "../component/otp/OtpSection";

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    digit: false,
    special: false,
    confirm: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  useEffect(() => {
    const p = form.password;
    setPasswordChecks({
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      digit: /\d/.test(p),
      special: /[^A-Za-z0-9]/.test(p),
      confirm: form.confirmPassword === p && p.length > 0,
    });
  }, [form.password, form.confirmPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation checks
    if (!form.name.trim()) {
      showErrorToast("Please enter your full name");
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showErrorToast("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    if (!Object.values(passwordChecks).every(Boolean)) {
      showErrorToast("Please meet all password requirements");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await authFetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res) {
        showErrorToast("Connection error. Please try again");
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();

      if (res.ok) {
        showSuccessToast("Security code sent to your email");
        setStep(2);
      } else {
        showErrorToast(data.message || "Registration failed");
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
      className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Toast Container */}
      <Toast/>

      <motion.div
        key={step}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto"
      >
        <AuthHeader />

        <AuthCard
          title={step === 1 ? "Create Your Account" : "Verify Identity"}
          subtitle={
            step === 1
              ? "Join our platform today"
              : "Enter the security code sent to your email"
          }
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                onSubmit={handleRegister}
                className="space-y-4 sm:space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="grid grid-cols-1 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    icon="user"
                  />
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    icon="email"
                  />
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <PasswordInput
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create Secure Password"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <PasswordInput
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                    />
                  </motion.div>
                </motion.div>

                <PasswordStrengthBar checks={passwordChecks} />

                <PasswordRequirements checks={passwordChecks} />

                <SubmitButton
                  name={isSubmitting ? "Creating Account..." : "Create Account"}
                  disabled={isSubmitting}
                />

                <DividerWithText text="OR" />

                <motion.div
                  className="grid grid-cols-1 gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <OAuthButton provider="google" index={0} />
                  <OAuthButton provider="facebook" index={1} />
                </motion.div>

                <DividerWithText text="Already have an account?" />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Link
                    to="/login"
                    className="block w-full text-center border border-gray-300 hover:border-blue-400 text-blue-600 hover:text-blue-800 font-medium py-2.5 px-4 rounded-lg transition-all duration-300 hover:bg-blue-50"
                  >
                    Login to Your Account
                  </Link>
                </motion.div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <OtpSection
                  email={form.email}
                  onVerified={() => {
                    showSuccessToast("Account verified! Redirecting...");
                    setTimeout(() => navigate("/dashboard"), 1500);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </AuthCard>
      </motion.div>

      {/* Loading overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-full border-4 border-teal-500 border-t-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}