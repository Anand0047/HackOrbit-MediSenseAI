import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../Auth/component/Input";
import PasswordInput from "../../Auth/component/password/PasswordInput";
import OAuthButton from "../../Auth/component/OAuthButton";
import AuthHeader from "../../Auth/component/AuthHeader";
import SubmitButton from "../../Auth/component/SubmitButton";
import AuthCard from "../../Auth/component/AuthCard";
import DividerWithText from "../../Auth/component/DividerWithText";
import authFetch from "../../util/authFetch";
import { jwtDecode } from "jwt-decode";
import { Toast, showSuccessToast, showErrorToast } from "../../components/Toast";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const error = searchParams.get("error");

    const cleanUrl = () => {
      if (token || name || error) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    if (error) {
      handleOAuthError(error);
      cleanUrl();
      return;
    }

    if (token) {
      handleAuthSuccess(token, name ? `Welcome ${name}!` : "Login successful!");
      cleanUrl();
    }
  }, [navigate, searchParams]);

  const handleOAuthError = (error) => {
    switch(error) {
      case "email_not_found":
        showErrorToast("The email from your OAuth provider was not found");
        break;
      case "user_not_found":
        showErrorToast("No account exists with this email");
        break;
      default:
        showErrorToast("Couldn't complete OAuth login");
    }
  };

  const validate = () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      showErrorToast("Email is required");
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      showErrorToast("Please enter a valid email");
      isValid = false;
    } else if(!form.password) {
      showErrorToast("Password is required");
      isValid = false;
    }

    return isValid;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const res = await authFetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res) return; // authFetch already handled the error

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.message || data.error || "Login failed";
        showErrorToast(errorMessage);
        return;
      }

      const token = data?.token;
      if (token) {
        handleAuthSuccess(token, "Welcome back! Redirecting...");
      } else {
        showErrorToast("Received invalid response from server");
      }
    } catch (error) {
      showErrorToast("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSuccess = (token, message) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem("token", token);
      localStorage.setItem("userName", decoded.name || "User"); // Store name
      
      showSuccessToast(message);

      setTimeout(() => {
        navigate(decoded.role === "ADMIN" ? "/admin/dashboard" : "/");
      }, 1200);
    } catch (err) {
      console.error("JWT Decode failed:", err);
      showErrorToast("Session validation failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      {/* Toast Notifications */}
      <Toast />

      {/* Loading Overlay */}
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

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isSubmitting ? 0.7 : 1, 
          y: 0,
          filter: isSubmitting ? "blur(2px)" : "blur(0px)"
        }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <AuthHeader />

        <AuthCard title="Welcome Back" subtitle="Sign in to continue your career journey">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 10
                }}
                whileHover={{
                  color: "#1d4ed8",
                  transition: { duration: 0.2 }
                }}
              >
                Email Address
                <motion.span 
                  className="text-red-500 ml-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  *
                </motion.span>
              </motion.label>

              <Input
                name="email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-1">
                <motion.label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.3,
                    type: "spring",
                    stiffness: 300,
                    damping: 10
                  }}
                  whileHover={{
                    color: "#1d4ed8",
                    transition: { duration: 0.2 }
                  }}
                >
                  Password
                  <motion.span 
                    className="text-red-500 ml-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    *
                  </motion.span>
                </motion.label>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                  >
                    Forgot Password?
                  </Link>
                </motion.div>
              </div>
              <PasswordInput
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SubmitButton 
                name={isSubmitting ? "Signing In..." : "Sign In"} 
                disabled={isSubmitting}
              />
            </motion.div>
          </form>

          {/* OAuth Options */}
          <DividerWithText text="OR" />
          <OAuthButton provider="google" index={0} />

          {/* Registration Link */}
          <DividerWithText text="New to MediSense?" />
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link
              to="/register"
              className="block w-full text-center border border-gray-300 hover:border-blue-400 text-blue-600 hover:text-blue-800 font-medium py-2.5 px-4 rounded-lg transition-all duration-300 hover:bg-blue-50"
            >
              Create an account
            </Link>
          </motion.div>
        </AuthCard>
      </motion.div>
    </div>
  );
}