package com.hackOrbit.mediSense.Auth.controller;

import com.hackOrbit.mediSense.Auth.dto.*;
import com.hackOrbit.mediSense.Auth.model.OtpType;
import com.hackOrbit.mediSense.Auth.model.User;
import com.hackOrbit.mediSense.Auth.respository.UserRepository;
import com.hackOrbit.mediSense.Auth.service.AuthService;
import com.hackOrbit.mediSense.Auth.service.EmailService;
import com.hackOrbit.mediSense.Auth.service.OtpService;
import com.hackOrbit.mediSense.Auth.util.JwtUtil;
import com.hackOrbit.mediSense.Auth.util.PasswordValidator;
import com.hackOrbit.mediSense.Auth.util.RateLimit;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private OtpService otpService;
    @Autowired private EmailService emailService;
    @Autowired private AuthService authService;
    @Autowired private JwtUtil jwtUtil;

    // Temporary store for users pending OTP verification
    private final Map<String, RegisterRequest> tempUserStore = new ConcurrentHashMap<>();

    // ========== Register ==========
    @PostMapping("/register")
    @RateLimit(key = "register", maxRequests = 5, timeWindow = 60000)
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered!"));
        }

        if (tempUserStore.containsKey(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Registration already in progress for this email. Please verify OTP sent to your email."));
        }

        String error = PasswordValidator.validate(request.getPassword(), request.getConfirmPassword());
        if (error != null) {
            return ResponseEntity.badRequest().body(Map.of("message", error));
        }

        String otp = otpService.generateOtp(request.getEmail(), OtpType.EMAIL_VERIFICATION);
        emailService.sendRegistrationOtpEmail(request.getEmail(), otp);

        tempUserStore.put(request.getEmail(), request);
        logger.info("Registration started for email: {}", request.getEmail());
        return ResponseEntity.ok(Map.of("message", "OTP sent to your email"));
    }

    // ========== Verify OTP ==========
    // Update the verify-otp method
    @PostMapping("/verify-otp")
    @RateLimit(key = "verify-otp", maxRequests = 3, timeWindow = 60000)
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerificationRequest request) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp(), OtpType.EMAIL_VERIFICATION);

        if (isValid) {
            RegisterRequest temp = tempUserStore.get(request.getEmail());
            if (temp == null) {
                logger.error("No user data found in tempUserStore for email: {}", request.getEmail());
                return ResponseEntity.badRequest().body(Map.of("message", "User data not found. Try registering again."));
            }

            try {
                User user = User.builder()
                        .name(temp.getName())
                        .email(temp.getEmail())
                        .password(passwordEncoder.encode(temp.getPassword()))
                        .provider("local")
                        .build();

                User savedUser = userRepository.save(user);
                logger.info("User created and saved: {}", user.getEmail());
                otpService.clearOtp(request.getEmail(), OtpType.EMAIL_VERIFICATION);
                tempUserStore.remove(request.getEmail());

                String token = jwtUtil.generateToken(savedUser);

                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "name", savedUser.getName(),
                        "message", "Account verified successfully!"
                ));
            } catch (Exception e) {
                logger.error("Error saving user for email {}: {}", request.getEmail(), e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Failed to create user. Please try again later."));
            }
        } else {
            logger.warn("Invalid OTP attempt for email: {}", request.getEmail());
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP"));
        }
    }


    // ========== Resend OTP ==========
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || !email.contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid email"));
        }

        if (!tempUserStore.containsKey(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "No registration in progress for this email. Please register first."));
        }

        try {
            String otp = otpService.generateOtp(email, OtpType.EMAIL_VERIFICATION);
            emailService.sendRegistrationOtpEmail(email, otp);
            logger.info("OTP resent for registration to email: {}", email);
            return ResponseEntity.ok(Map.of("message", "OTP resent successfully"));
        } catch (Exception e) {
            logger.error("Failed to resend OTP for email {}: {}", email, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Failed to resend OTP"));
        }
    }

    // ========== Login ==========
    // Update the login method
    @PostMapping("/login")
    @RateLimit(key = "login", maxRequests = 5, timeWindow = 60000)
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(user);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "name", user.getName(),
                "message", "Login successful"
        ));
    }

    // ========== Forgot Password ==========
    @PostMapping("/forgot-password")
    @RateLimit(key = "forgot-password", maxRequests = 3, timeWindow = 60000)
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        Optional<User> user = userRepository.findByEmail(request.getEmail());
        if (user.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Email not found"));
        }

        String otp = otpService.generateOtp(request.getEmail(), OtpType.PASSWORD_RESET);
        emailService.sendPasswordResetOtpEmail(request.getEmail(), otp);
        return ResponseEntity.ok(Map.of("message", "OTP sent to your email"));
    }

    // ========== Verify OTP for Password Reset ==========
    @PostMapping("/verify-reset-otp")
    @RateLimit(key = "verify-reset-otp", maxRequests = 3, timeWindow = 60000)
    public ResponseEntity<?> verifyResetOtp(@RequestBody OtpVerificationRequest request) {
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp(), OtpType.PASSWORD_RESET);

        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP"));
        }
    }

    // ========== Resend Reset Password OTP ==========
    @PostMapping("/resend-reset-otp")
    @RateLimit(key = "resend-reset-otp", maxRequests = 3, timeWindow = 60000)
    public ResponseEntity<?> resendResetOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");

        if (email == null || !email.contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid email"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not registered"));
        }

        String otp = otpService.generateOtp(email, OtpType.PASSWORD_RESET);
        emailService.sendPasswordResetOtpEmail(email, otp);
        return ResponseEntity.ok(Map.of("message", "OTP resent successfully to your email."));
    }

    // ========== Reset Password ==========
    @PostMapping("/reset-password")
    @RateLimit(key = "reset-password", maxRequests = 3, timeWindow = 60000)
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        String error = PasswordValidator.validate(request.getNewPassword(), request.getConfirmPassword());
        if (error != null) {
            return ResponseEntity.badRequest().body(Map.of("message", error));
        }

        if (request.getNewPassword().getBytes().length > 72) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password too long to be processed securely."));
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otpService.clearOtp(request.getEmail(), OtpType.PASSWORD_RESET);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully!"));
    }

    // ========== Save OAuth User ==========
    // Update the OAuth endpoint
    @GetMapping("/oauth/save-user")
    public ResponseEntity<?> saveOAuthUser(@AuthenticationPrincipal OAuth2User oauthUser) {
        if (oauthUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "No OAuth user found"));
        }

        String name = oauthUser.getAttribute("name");
        String email = oauthUser.getAttribute("email");

        if (email == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Email not found from OAuth provider"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;

        if (userOpt.isEmpty()) {
            user = User.builder()
                    .name(name)
                    .email(email)
                    .password(null)
                    .provider("google")
                    .build();
            user = userRepository.save(user);
        } else {
            user = userOpt.get();
        }

        String token = jwtUtil.generateToken(user);

        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", "http://localhost:5173/login?token=" + token + "&name=" + user.getName())
                .build();
    }

}