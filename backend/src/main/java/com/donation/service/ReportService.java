package com.donation.service;

import com.donation.dto.Dtos;
import com.donation.entity.Report;
import com.donation.entity.User;
import com.donation.exception.ResourceNotFoundException;
import com.donation.repository.ReportRepository;
import com.donation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public Report submitReport(Dtos.ReportRequestDto dto) {
        User reporter = userRepository.findById(dto.getReporterId())
                .orElseThrow(() -> new ResourceNotFoundException("Reporter not found"));
        
        User reportedUser = userRepository.findById(dto.getReportedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Reported user not found"));

        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedUser(reportedUser);
        report.setReason(dto.getReason());
        report.setDescription(dto.getDescription());

        Report savedReport = reportRepository.save(report);

        // Update reported user's report count
        reportedUser.setReportCount(reportedUser.getReportCount() + 1);
        
        // Email logic
        emailService.sendReportNotification(reportedUser, dto.getReason(), dto.getDescription());

        // Threshold checks
        if (reportedUser.getReportCount() == 7) {
            emailService.sendWarningNotification(reportedUser);
        } else if (reportedUser.getReportCount() >= 10) {
            reportedUser.setBlocked(true);
            emailService.sendAccountBlockedNotification(reportedUser, dto.getReason());
        }

        userRepository.save(reportedUser);
        return savedReport;
    }
}
