package com.donation.controller;

import com.donation.dto.Dtos;
import com.donation.entity.Fulfillment;
import com.donation.entity.Request;
import com.donation.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @PostMapping
    public ResponseEntity<com.donation.dto.ApiResponse<Request>> createRequest(@RequestBody Dtos.CreateRequestDto dto) {
        Request request = requestService.createRequest(dto);
        return ResponseEntity.ok(new com.donation.dto.ApiResponse<>(200, "Request created successfully", request));
    }

    @GetMapping
    public ResponseEntity<com.donation.dto.ApiResponse<List<Request>>> getAllRequests() {
        List<Request> requests = requestService.getAllRequests();
        return ResponseEntity.ok(new com.donation.dto.ApiResponse<>(200, "Requests retrieved successfully", requests));
    }

    @GetMapping("/receiver/{userId}")
    public ResponseEntity<com.donation.dto.ApiResponse<List<Request>>> getRequestsByReceiver(
            @PathVariable Long userId) {
        List<Request> requests = requestService.getRequestsByReceiver(userId);
        return ResponseEntity.ok(new com.donation.dto.ApiResponse<>(200, "Requests retrieved successfully", requests));
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.donation.dto.ApiResponse<Request>> getRequest(@PathVariable Long id) {
        Request request = requestService.getRequest(id);
        return ResponseEntity.ok(new com.donation.dto.ApiResponse<>(200, "Request retrieved successfully", request));
    }

    @PostMapping("/fulfill")
    public ResponseEntity<com.donation.dto.ApiResponse<Fulfillment>> fulfillRequest(
            @RequestBody Dtos.FulfillRequestDto dto) {
        Fulfillment fulfillment = requestService.fulfillRequest(dto);
        return ResponseEntity
                .ok(new com.donation.dto.ApiResponse<>(200, "Request fulfilled successfully", fulfillment));
    }

    @GetMapping("/receiver/{userId}/fulfillments")
    public ResponseEntity<com.donation.dto.ApiResponse<List<Fulfillment>>> getFulfillmentsByReceiver(
            @PathVariable Long userId) {
        List<Fulfillment> fulfillments = requestService.getFulfillmentsByReceiver(userId);
        return ResponseEntity
                .ok(new com.donation.dto.ApiResponse<>(200, "Fulfillments retrieved successfully", fulfillments));
    }

    @GetMapping("/donor/{userId}/fulfillments")
    public ResponseEntity<com.donation.dto.ApiResponse<List<Fulfillment>>> getFulfillmentsByDonor(
            @PathVariable Long userId) {
        List<Fulfillment> fulfillments = requestService.getFulfillmentsByDonor(userId);
        return ResponseEntity
                .ok(new com.donation.dto.ApiResponse<>(200, "Fulfillments retrieved successfully", fulfillments));
    }

    @PutMapping("/fulfillments/{id}/status")
    public ResponseEntity<com.donation.dto.ApiResponse<Fulfillment>> updateFulfillmentStatus(
            @PathVariable Long id,
            @RequestParam com.donation.enums.FulfillmentStatus status) {
        Fulfillment fulfillment = requestService.updateFulfillmentStatus(id, status);
        return ResponseEntity
                .ok(new com.donation.dto.ApiResponse<>(200, "Fulfillment status updated successfully", fulfillment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<com.donation.dto.ApiResponse<Void>> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.ok(new com.donation.dto.ApiResponse<>(200, "Request deleted successfully", null));
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<com.donation.dto.ApiResponse<Request>> closeRequest(@PathVariable Long id) {
        Request request = requestService.closeRequest(id);
        return ResponseEntity.ok(new com.donation.dto.ApiResponse<>(200, "Request closed successfully", request));
    }
}
