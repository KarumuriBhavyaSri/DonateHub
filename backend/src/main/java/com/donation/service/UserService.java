package com.donation.service;

import com.donation.dto.Dtos;
import com.donation.entity.User;
import com.donation.repository.UserRepository;
import com.donation.repository.FulfillmentRepository;
import com.donation.repository.DonationClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FulfillmentRepository fulfillmentRepository;

    @Autowired
    private DonationClaimRepository donationClaimRepository;

    public User register(Dtos.RegisterRequest request) {

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email cannot be empty");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName() != null ? request.getFullName().trim() : null);
        user.setEmail(email);
        user.setPassword(request.getPassword() != null ? request.getPassword().trim() : null);
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        user.setAddress(request.getAddress() != null ? request.getAddress().trim() : null);
        user.setRole(request.getRole());

        // Set detailed address fields
        user.setHouseNumber(request.getHouseNumber());
        user.setStreetLandmark(request.getStreetLandmark());
        user.setAreaLocality(request.getAreaLocality());
        user.setCity(request.getCity());
        user.setDistrict(request.getDistrict());
        user.setState(request.getState());
        user.setPincode(request.getPincode());
        user.setCountry(request.getCountry());
        
        if (com.donation.enums.Role.RECEIVER.equals(request.getRole())) {
            user.setGovtCertificationId(request.getGovtCertificationId());
            user.setOrganizationName(request.getOrganizationName());
            user.setRunnerName(request.getRunnerName());
        }

        return userRepository.save(user);
    }

    public User login(Dtos.LoginRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String password = request.getPassword() != null ? request.getPassword().trim() : "";
        
        System.out.println("UserService.login - searching for: " + email);
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            System.out.println("User found! Comparing passwords...");
            String dbPass = user.get().getPassword() != null ? user.get().getPassword().trim() : "";
            if (dbPass.equals(password)) {
                if (user.get().isBlocked()) {
                    throw new RuntimeException("Your account has been blocked due to multiple reports. Please contact support.");
                }
                System.out.println("Password match!");
                return user.get();
            } else {
                System.out.println("Password mismatch. DB has: '" + user.get().getPassword() + "' vs provided: '"
                        + request.getPassword() + "'");
            }
        } else {
            System.out.println("User not found in DB with email: " + request.getEmail());
        }

        throw new RuntimeException("Invalid credentials");
    }

    public User getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Recount logic for existing users whose donation count might be out of sync
        if (user.getRole() == com.donation.enums.Role.DONOR && user.getDonationCount() == 0) {
            long fulfilledRequests = fulfillmentRepository.findByDonor(user).stream()
                    .filter(f -> f.getStatus() == com.donation.enums.FulfillmentStatus.DELIVERED)
                    .count();

            long completedClaims = donationClaimRepository.findByDonationItem_DonationPost_DonorId(user.getId())
                    .stream()
                    .filter(c -> c.getStatus() == com.donation.enums.ClaimStatus.COMPLETED)
                    .count();

            int total = (int) (fulfilledRequests + completedClaims);
            if (total > 0) {
                user.setDonationCount(total);
                userRepository.save(user);
            }
        }

        return user;
    }

    public User updateUser(Long id, Dtos.UpdateUserDto dto) {
        User user = getUserById(id);
        if (dto.getFullName() != null)
            user.setFullName(dto.getFullName());
        if (dto.getPhone() != null)
            user.setPhone(dto.getPhone());
        if (dto.getAddress() != null)
            user.setAddress(dto.getAddress());
        
        if (com.donation.enums.Role.RECEIVER.equals(user.getRole())) {
            if (dto.getGovtCertificationId() != null) user.setGovtCertificationId(dto.getGovtCertificationId());
            if (dto.getOrganizationName() != null) user.setOrganizationName(dto.getOrganizationName());
            if (dto.getRunnerName() != null) user.setRunnerName(dto.getRunnerName());
        }

        return userRepository.save(user);
    }

    public void changePassword(Long id, Dtos.ChangePasswordDto dto) {
        User user = getUserById(id);
        if (!user.getPassword().equals(dto.getCurrentPassword())) {
            throw new RuntimeException("Invalid current password");
        }
        user.setPassword(dto.getNewPassword());
        userRepository.save(user);
    }

    public long getDonorCount() {
        return userRepository.countByRole(com.donation.enums.Role.DONOR);
    }

    public long getReceiverCount() {
        return userRepository.countByRole(com.donation.enums.Role.RECEIVER);
    }

    public String uploadProfilePicture(Long userId, org.springframework.web.multipart.MultipartFile file) {
        User user = getUserById(userId);
        if (file.isEmpty()) {
            throw new RuntimeException("Please select a file to upload");
        }

        try {
            String uploadDir = "uploads/profile_pictures/";
            java.io.File directory = new java.io.File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String fileName = "user_" + userId + "_" + System.currentTimeMillis() + extension;
            java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir, fileName);
            java.nio.file.Files.copy(file.getInputStream(), filePath,
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/profile_pictures/" + fileName;
            user.setProfileImageUrl(fileUrl);
            userRepository.save(user);

            return fileUrl;
        } catch (java.io.IOException e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    @org.springframework.transaction.annotation.Transactional
    public java.util.List<String> uploadGalleryImages(Long userId, org.springframework.web.multipart.MultipartFile[] files) {
        User user = getUserById(userId);
        
        if (files == null || files.length == 0) {
            throw new RuntimeException("Please select files to upload");
        }
        
        if (user.getGalleryImages() == null) {
            user.setGalleryImages(new java.util.ArrayList<>());
        }
        
        if (user.getGalleryImages().size() + files.length > 5) {
            throw new RuntimeException("Cannot upload more than 5 images in your gallery");
        }

        java.util.List<String> uploadedUrls = new java.util.ArrayList<>();
        
        try {
            String uploadDir = "uploads/gallery_images/";
            java.io.File directory = new java.io.File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            for (org.springframework.web.multipart.MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String originalFilename = file.getOriginalFilename();
                    String extension = "";
                    if (originalFilename != null && originalFilename.contains(".")) {
                        extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    }

                    String fileName = "user_gallery_" + userId + "_" + System.currentTimeMillis() + "_" + java.util.UUID.randomUUID().toString().substring(0, 5) + extension;
                    java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir, fileName);
                    java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                    String fileUrl = "/uploads/gallery_images/" + fileName;
                    uploadedUrls.add(fileUrl);
                }
            }

            user.getGalleryImages().addAll(uploadedUrls);
            userRepository.save(user);

        } catch (java.io.IOException e) {
            throw new RuntimeException("Could not store the gallery files. Error: " + e.getMessage());
        }

        return user.getGalleryImages();
    }
}
