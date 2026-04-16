package com.donation.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    // In-memory storage for OTPs: Email -> OTP
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Map<String, Long> otpExpiry = new ConcurrentHashMap<>();

    private static final long OTP_VALID_DURATION_MS = 5 * 60 * 1000; // 5 minutes

    public String generateOtp(String email) {
        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        otpStorage.put(email, otp);
        otpExpiry.put(email, System.currentTimeMillis() + OTP_VALID_DURATION_MS);

        // Send OTP via email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your DonateHub OTP Code");
            message.setText("Your OTP for DonateHub registration is: " + otp + "\n\nThis OTP is valid for 5 minutes.\n\nIf you didn't request this, please ignore this email.");
            message.setFrom("donatehub@gmail.com");
            mailSender.send(message);
            System.out.println("OTP sent to " + email + ": " + otp);
        } catch (Exception e) {
            // Fallback to console if email fails
            System.out.println("Email sending failed. OTP for " + email + ": " + otp);
            System.err.println("Email error: " + e.getMessage());
        }

        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        if (!otpStorage.containsKey(email)) {
            return false;
        }

        Long expiryTime = otpExpiry.get(email);
        if (System.currentTimeMillis() > expiryTime) {
            otpStorage.remove(email);
            otpExpiry.remove(email);
            return false;
        }

        String storedOtp = otpStorage.get(email);
        if (storedOtp.equals(otp)) {
            // Clear OTP after successful validation
            otpStorage.remove(email);
            otpExpiry.remove(email);
            return true;
        }

        return false;
    }
}
