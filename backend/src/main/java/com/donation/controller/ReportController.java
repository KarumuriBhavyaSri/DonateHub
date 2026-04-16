package com.donation.controller;

import com.donation.dto.ApiResponse;
import com.donation.dto.Dtos;
import com.donation.entity.Report;
import com.donation.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping
    public ResponseEntity<ApiResponse<Report>> submitReport(@RequestBody Dtos.ReportRequestDto dto) {
        Report report = reportService.submitReport(dto);
        return ResponseEntity.ok(new ApiResponse<>(200, "Report submitted successfully", report));
    }
}
