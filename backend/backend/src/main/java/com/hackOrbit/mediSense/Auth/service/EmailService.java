package com.hackOrbit.mediSense.Auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.time.Year;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private static final String REGISTRATION_TEMPLATE = "UserVerificationEmail/otp-email.html";
    private static final String PASSWORD_RESET_TEMPLATE = "PasswordResetVerificationEmail/otp-reset-password.html";

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Autowired
    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine){
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    private void sendEmailWithTemplate(String to, String otp, String subject, String templatePath){
        try {
            logger.info("Preparing to send '{}' email to {}", subject, to);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            Context context = new Context();
            context.setVariable("name", to.split("@")[0]);
            context.setVariable("otp", otp);
            context.setVariable("year", Year.now().getValue());

            String htmlContent = templateEngine.process(templatePath, context);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);

            logger.info("Email sent successfully to {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email : " + e.getMessage(), e);
        }
    }

    public void sendRegistrationOtpEmail(String to, String otp){
        sendEmailWithTemplate(
                to,
                otp,
                "Verify your MediSense Account",
                REGISTRATION_TEMPLATE
        );
    }

    public void sendPasswordResetOtpEmail(String to, String otp){
        sendEmailWithTemplate(
                to,
                otp,
                "Reset your MediSense password",
                PASSWORD_RESET_TEMPLATE
        );
    }
}