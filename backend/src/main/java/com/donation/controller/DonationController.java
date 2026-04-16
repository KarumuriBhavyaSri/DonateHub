package com.donation.controller;

import com.donation.dto.ApiResponse;
import com.donation.dto.Dtos;
import com.donation.entity.DonationClaim;
import com.donation.entity.DonationPost;
import com.donation.enums.ClaimStatus;
import com.donation.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @PostMapping
    public ResponseEntity<ApiResponse<DonationPost>> createDonationPost(@RequestBody Dtos.CreateDonationDto dto) {
        DonationPost post = donationService.createDonationPost(dto);
        return ResponseEntity.ok(new ApiResponse<>(200, "Donation post created successfully", post));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DonationPost>>> getAllDonationPosts() {
        List<DonationPost> posts = donationService.getAllDonationPosts();
        return ResponseEntity.ok(new ApiResponse<>(200, "Donation posts retrieved successfully", posts));
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<ApiResponse<List<DonationPost>>> getDonationPostsByDonor(@PathVariable Long donorId) {
        List<DonationPost> posts = donationService.getDonationPostsByDonor(donorId);
        return ResponseEntity.ok(new ApiResponse<>(200, "Donor's donation posts retrieved", posts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DonationPost>> getDonationPost(@PathVariable Long id) {
        DonationPost post = donationService.getDonationPost(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Donation post retrieved", post));
    }

    @PostMapping("/claim")
    public ResponseEntity<ApiResponse<DonationClaim>> claimDonationItem(@RequestBody Dtos.ClaimDonationDto dto) {
        DonationClaim claim = donationService.claimDonationItem(dto);
        return ResponseEntity.ok(new ApiResponse<>(200, "Item claimed successfully", claim));
    }

    @GetMapping("/claims/receiver/{receiverId}")
    public ResponseEntity<ApiResponse<List<DonationClaim>>> getClaimsByReceiver(@PathVariable Long receiverId) {
        List<DonationClaim> claims = donationService.getClaimsByReceiver(receiverId);
        return ResponseEntity.ok(new ApiResponse<>(200, "Receiver claims retrieved", claims));
    }

    @GetMapping("/claims/donor/{donorId}")
    public ResponseEntity<ApiResponse<List<DonationClaim>>> getClaimsByDonor(@PathVariable Long donorId) {
        List<DonationClaim> claims = donationService.getClaimsByDonor(donorId);
        return ResponseEntity.ok(new ApiResponse<>(200, "Donor claims retrieved", claims));
    }

    @PutMapping("/claims/{claimId}/status")
    public ResponseEntity<ApiResponse<DonationClaim>> updateClaimStatus(
            @PathVariable Long claimId,
            @RequestParam ClaimStatus status) {
        DonationClaim claim = donationService.updateClaimStatus(claimId, status);
        return ResponseEntity.ok(new ApiResponse<>(200, "Claim status updated", claim));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDonationPost(@PathVariable Long id) {
        donationService.deleteDonationPost(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Donation post deleted successfully", null));
    }
}
