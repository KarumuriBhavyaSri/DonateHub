package com.donation.service;

import com.donation.entity.DonationPost;
import com.donation.entity.Request;
import com.donation.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void notifyDonorsOfNewRequest(Request request, List<User> donors) {
        String subject = "New Helping Hand Needed: " + request.getTitle();
        String body = String.format(
            "Hello Donor,\n\n" +
            "A new request for help has been posted by %s:\n" +
            "Title: %s\n" +
            "Location: %s\n\n" +
            "Please visit DonateHub to see how you can help: %s/donor\n\n" +
            "Thank you for your generosity!",
            request.getReceiver().getOrganizationName() != null ? request.getReceiver().getOrganizationName() : request.getReceiver().getFullName(),
            request.getTitle(),
            request.getLocation(),
            frontendUrl
        );

        sendEmailToBatch(donors, subject, body);
    }

    public void notifyReceiversOfNewDonation(DonationPost post, List<User> receivers) {
        String subject = "New Donation Available: " + post.getTitle();
        String body = String.format(
            "Hello,\n\n" +
            "A new donation has been posted by a Donor:\n" +
            "Title: %s\n" +
            "Location: %s\n\n" +
            "Please visit DonateHub to check if these items address your needs: %s/receiver\n\n" +
            "Best regards,\nDonateHub Team",
            post.getTitle(),
            post.getLocation(),
            frontendUrl
        );

        sendEmailToBatch(receivers, subject, body);
    }

    public void sendReportNotification(User donor, String reason, String details) {
        String subject = "Important Information Regarding Your Profile Activity";
        String body = String.format(
            "Hello %s,\n\n" +
            "It has come to our attention that a recipient has reported an issue related to your interaction on DonateHub.\n\n" +
            "Reason: %s\n" +
            "Explanation provided: %s\n\n" +
            "Please ensure you follow our community guidelines. Continuous reports may put your profile at risk, leading to account suspension.\n\n" +
            "If you have an explanation or wish to file a claim regarding this report, please contact our support team.\n\n" +
            "Best regards,\nDonateHub Team",
            donor.getFullName(),
            reason,
            (details != null && !details.isBlank()) ? details : "No additional details provided"
        );

        sendEmail(donor.getEmail(), subject, body);
    }

    public void sendWarningNotification(User donor) {
        String subject = "URGENT: Profile Warning - Multiple Reports Received";
        String body = String.format(
            "Hello %s,\n\n" +
            "We are reaching out to inform you that your account has reached 7 reports from different users on our platform.\n\n" +
            "This is a serious warning. If the number of reports reaches 10, your account will be automatically blocked, and you will no longer be able to use the DonateHub platform.\n\n" +
            "We strongly encourage you to review your interactions and adhere to the platform's code of conduct.\n\n" +
            "Best regards,\nDonateHub Team",
            donor.getFullName()
        );

        sendEmail(donor.getEmail(), subject, body);
    }

    public void sendAccountBlockedNotification(User donor, String reason) {
        String subject = "Final Notice: Your Account Has Been Blocked";
        String body = String.format(
            "Hello %s,\n\n" +
            "We regret to inform you that your DonateHub account has been blocked due to reaching the maximum threshold of 10 reports.\n\n" +
            "The most recent report reason was: %s\n\n" +
            "As a result of repeated violations of our community standards, you can no longer access or use your account.\n\n" +
            "If you believe this is an error, you may contact our appeals team.\n\n" +
            "DonateHub Team",
            donor.getFullName(),
            reason
        );

        sendEmail(donor.getEmail(), subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        if (to == null) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("noreply.donatehub@gmail.com");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    private void sendEmailToBatch(List<User> users, String subject, String body) {
        for (User user : users) {
            if (user.getEmail() != null) {
                try {
                    SimpleMailMessage message = new SimpleMailMessage();
                    message.setTo(user.getEmail());
                    message.setSubject(subject);
                    message.setText(body);
                    message.setFrom("noreply.donatehub@gmail.com");
                    mailSender.send(message);
                } catch (Exception e) {
                    System.err.println("Failed to send email to " + user.getEmail() + ": " + e.getMessage());
                }
            }
        }
    }
}
