package com.hackOrbit.mediSense.Auth.service;

import com.hackOrbit.mediSense.Auth.dto.LoginRequest;
import com.hackOrbit.mediSense.Auth.dto.LoginResponse;
import com.hackOrbit.mediSense.Auth.dto.RegisterRequest;
import com.hackOrbit.mediSense.Auth.dto.ResetPasswordRequest;
import com.hackOrbit.mediSense.Auth.model.OtpType;
import com.hackOrbit.mediSense.Auth.model.User;
import com.hackOrbit.mediSense.Auth.respository.UserRepository;
import com.hackOrbit.mediSense.Auth.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       EmailService emailService,
                       PasswordEncoder passwordEncoder,
                       OtpService otpService,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
        this.jwtUtil = jwtUtil;
    }

    // ========== Register (send registration OTP) ==========
    public ResponseEntity<Map<String, String>> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email already registered"));
        }

        String otp = otpService.generateOtp(request.getEmail(), OtpType.EMAIL_VERIFICATION);
        emailService.sendRegistrationOtpEmail(request.getEmail(), otp);

        return ResponseEntity.ok(Map.of("message", "OTP sent to your email for verification"));
    }

    // ========== Resend Registration OTP ==========
    public ResponseEntity<Map<String, String>> resendOtp(String email) {
        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Email not registered"));
        }

        String newOtp = otpService.generateOtp(email, OtpType.EMAIL_VERIFICATION);
        emailService.sendRegistrationOtpEmail(email, newOtp);
        return ResponseEntity.ok(Map.of("message", "OTP resent successfully"));
    }

    // ========== Send Reset OTP ==========
    public ResponseEntity<Map<String, String>> sendResetOtp(String email) {
        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Email not registered"));
        }

        String otp = otpService.generateOtp(email, OtpType.PASSWORD_RESET);
        emailService.sendPasswordResetOtpEmail(email, otp);

        return ResponseEntity.ok(Map.of("message", "OTP sent to email for password reset"));
    }

    // ========== Verify Reset OTP ==========
    public ResponseEntity<Map<String, String>> verifyResetOtp(String email, String otp) {
        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Email not registered"));
        }

        boolean isValid = otpService.verifyOtp(email, otp, OtpType.PASSWORD_RESET);
        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "OTP verified"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Invalid or expired OTP"));
    }

    // ========== Reset Password ==========
    public ResponseEntity<Map<String, String>> resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Passwords do not match"));
        }

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otpService.clearOtp(request.getEmail(), OtpType.PASSWORD_RESET);

        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }

    // ========== Login ==========
    public ResponseEntity<?> login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            logger.warn("Login attempt for non-existent email: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Email not registered"));
        }

        User user = userOpt.get();
        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warn("Invalid password attempt for email: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid password"));
        }

        String token = jwtUtil.generateToken(user);

        return ResponseEntity.ok(new LoginResponse(
                token,
                "Login successful",
                user.getEmail()
        ));
    }
}