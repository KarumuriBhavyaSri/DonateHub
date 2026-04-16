package com.donation.controller;

import com.donation.dto.ApiResponse;
import com.donation.service.RequestService;
import com.donation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StatsController {

    @Autowired
    private UserService userService;

    @Autowired
    private RequestService requestService;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("donors", userService.getDonorCount());
            stats.put("receivers", userService.getReceiverCount());
            stats.put("donations", requestService.getDeliveredDonationCount());

            return ResponseEntity.ok(
                    new ApiResponse<>(200, "Stats retrieved successfully", stats));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(500, "Error: " + e.getMessage(), null));
        }
    }
}
