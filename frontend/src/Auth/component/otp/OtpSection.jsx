import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OtpInput from "./OtpInput";
import SubmitButton from "../SubmitButton";
import authFetch from "../../../util/authFetch";
import { showSuccessToast, showErrorToast, showWarningToast } from "../../../components/Toast";
import { FaShieldAlt, FaClock, FaPaperPlane } from "react-icons/fa";

export default function OtpSection({ email, onVerified, flow = "register" }) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // === Verify OTP ===
  const handleOtpVerify = async () => {
    setIsVerifying(true);
    const endpoint =
      flow === "reset"
        ? "http://localhost:8080/api/auth/verify-reset-otp"
        : "http://localhost:8080/api/auth/verify-otp";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join("") }),
      });

      const data = await res.json();
      if (res.ok) {
        showSuccessToast(data.message || "Identity verified successfully");
        onVerified();
      } else {
        showErrorToast(data.message || "Invalid security code");
      }
    } catch {
      showErrorToast("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // === Resend OTP ===
  const handleResendOtp = async () => {
    try {
      const res = await authFetch(
        flow === "reset"
          ? "http://localhost:8080/api/auth/resend-reset-otp"
          : "http://localhost:8080/api/auth/resend-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res) {
        showErrorToast("Connection error. Please try again");
        return;
      }

      if (res.status === 429) {
        showWarningToast("Please wait before requesting another code");
        return;
      }

      const contentType = res.headers.get("Content-Type") || "";
      let msg = "New security code sent";

      if (contentType.includes("application/json")) {
        const data = await res.json();
        msg = data.message || msg;
      } else {
        msg = await res.text();
      }

      if (res.ok) {
        showSuccessToast(msg);
        setTimer(60);
        setCanResend(false);
      } else {
        showErrorToast(msg);
      }
    } catch {
      showErrorToast("Failed to resend code. Please try again.");
    }
  };

  // === Countdown Timer ===
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 sm:p-6 space-y-4 sm:space-y-6"
    >
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-center mb-3">
          <FaShieldAlt className="text-teal-600 text-2xl" />
        </div>
        <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">
          A 6-digit security code has been sent to{" "}
          <span className="font-medium text-teal-600">{email}</span>
        </p>
      </motion.div>

      <OtpInput value={otp} onChange={setOtp} />

      <motion.div
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        <SubmitButton 
          label={isVerifying ? "Verifying..." : "Verify Identity"} 
          onClick={handleOtpVerify} 
          type="button"
          disabled={isVerifying || otp.some(digit => digit === "")}
          icon={isVerifying ? null : <FaShieldAlt className="mr-2" />}
        />
      </motion.div>

      <motion.p 
        className="text-xs sm:text-sm text-gray-500 text-center flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {canResend ? (
          <>
            <FaPaperPlane className="mr-1 text-teal-500" />
            <motion.button
              onClick={handleResendOtp}
              className="text-teal-600 hover:text-teal-800 hover:underline ml-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Resend Security Code
            </motion.button>
          </>
        ) : (
          <>
            <FaClock className="mr-1 text-gray-400" />
            <motion.span
              key={timer}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              Resend in {timer}s
            </motion.span>
          </>
        )}
      </motion.p>

      <AnimatePresence>
        {isVerifying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center pt-2"
          >
            <motion.div
              className="h-1 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "50%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}