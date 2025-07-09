package com.hackOrbit.mediSense.Auth.security;

import com.hackOrbit.mediSense.Auth.model.User;
import com.hackOrbit.mediSense.Auth.respository.UserRepository;
import com.hackOrbit.mediSense.Auth.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public OAuth2SuccessHandler(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();


        Object emailAttr = oauthUser.getAttributes().get("email");
        if (emailAttr == null) {
            emailAttr = oauthUser.getAttributes().get("resolvedEmail");
        }
        String email = (emailAttr != null) ? emailAttr.toString() : null;

        if (email == null) {

            response.sendRedirect("http://localhost:5173/login?error=email_not_found");
            return;
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {

            response.sendRedirect("http://localhost:5173/login?error=user_not_found");
            return;
        }

        User user = optionalUser.get();
        String token = jwtUtil.generateToken(user);

        String redirectUrl = UriComponentsBuilder
                .fromUriString("http://localhost:5173/login")
                .queryParam("token", token)
                .build()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }
}