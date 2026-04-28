package com.meetlocalguide.platform.modules.notification.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.base-url:https://meetlocalguide.com}")
    private String frontendBaseUrl;

    @Value("${spring.mail.username:no-reply@meetlocalguide.com}")
    private String fromAddress;

    @Async
    public void sendEmailVerification(String email, String token) {
        String verifyUrl = frontendBaseUrl + "/auth/verify-email?token=" + token;
        sendMail(email, "Verify your MeetLocalGuide account",
                "Welcome to MeetLocalGuide.\n\nPlease verify your email by clicking the link below:\n" + verifyUrl
                        + "\n\nThis link expires in 24 hours.");
    }

    @Async
    public void sendPasswordReset(String email, String token) {
        String resetUrl = frontendBaseUrl + "/auth/reset-password?token=" + token;
        sendMail(email, "Reset your MeetLocalGuide password",
                "We received a password reset request.\n\nReset your password here:\n" + resetUrl
                        + "\n\nThis link expires in 30 minutes.");
    }

    private void sendMail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setFrom(fromAddress);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception exception) {
            log.warn("Email dispatch failed for {}: {}", to, exception.getMessage());
        }
    }
}
