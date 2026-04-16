package com.donation.controller;

import com.donation.dto.ApiResponse;
import com.donation.dto.Dtos;
import com.donation.entity.User;
import com.donation.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Dtos.UserResponse>> getUser(@PathVariable Long id) {

        User user = userService.getUserById(id);

        Dtos.UserResponse dto = new Dtos.UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getRole().name(),
                user.getCreatedAt(),
                user.getDonationCount());

        // Set detailed address fields
        dto.setHouseNumber(user.getHouseNumber());
        dto.setStreetLandmark(user.getStreetLandmark());
        dto.setAreaLocality(user.getAreaLocality());
        dto.setCity(user.getCity());
        dto.setDistrict(user.getDistrict());
        dto.setState(user.getState());
        dto.setPincode(user.getPincode());
        dto.setCountry(user.getCountry());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setGalleryImages(user.getGalleryImages());
        dto.setGovtCertificationId(user.getGovtCertificationId());
        dto.setOrganizationName(user.getOrganizationName());
        dto.setRunnerName(user.getRunnerName());

        return ResponseEntity.ok(
                new ApiResponse<>(200, "User retrieved successfully", dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable Long id,
            @Valid @RequestBody Dtos.UpdateUserDto dto) {
        User user = userService.updateUser(id, dto);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "User updated successfully", user));
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@PathVariable Long id,
            @Valid @RequestBody Dtos.ChangePasswordDto dto) {
        userService.changePassword(id, dto);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Password changed successfully", null));
    }

    @PostMapping("/{id}/profile-picture")
    public ResponseEntity<ApiResponse<String>> uploadProfilePicture(
            @PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String profileImageUrl = userService.uploadProfilePicture(id, file);
        return ResponseEntity
                .ok(new ApiResponse<>(HttpStatus.OK.value(), "Profile picture uploaded successfully", profileImageUrl));
    }

    @PostMapping("/{id}/gallery")
    public ResponseEntity<ApiResponse<java.util.List<String>>> uploadGalleryImages(
            @PathVariable Long id,
            @RequestParam("files") org.springframework.web.multipart.MultipartFile[] files) {
        java.util.List<String> imageUrls = userService.uploadGalleryImages(id, files);
        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), "Gallery images uploaded successfully", imageUrls));
    }
}
