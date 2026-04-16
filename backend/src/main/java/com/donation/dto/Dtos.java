package com.donation.dto;

import com.donation.enums.Role;
import java.util.List;

public class Dtos {

    // ==============================
    // REGISTER REQUEST
    // ==============================
    public static class RegisterRequest {

        private String fullName;
        private String email;
        private String password;
        private String phone;
        private String address;
        private Role role;

        // Detailed address fields
        private String houseNumber;
        private String streetLandmark;
        private String areaLocality;
        private String city;
        private String district;
        private String state;
        private String pincode;
        private String country;
        
        // Receiver specific fields
        private String govtCertificationId;
        private String organizationName;
        private String runnerName;

        public RegisterRequest() {
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public Role getRole() {
            return role;
        }

        public void setRole(Role role) {
            this.role = role;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        // Getters and Setters for detailed address fields
        public String getHouseNumber() {
            return houseNumber;
        }

        public void setHouseNumber(String houseNumber) {
            this.houseNumber = houseNumber;
        }

        public String getStreetLandmark() {
            return streetLandmark;
        }

        public void setStreetLandmark(String streetLandmark) {
            this.streetLandmark = streetLandmark;
        }

        public String getAreaLocality() {
            return areaLocality;
        }

        public void setAreaLocality(String areaLocality) {
            this.areaLocality = areaLocality;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getDistrict() {
            return district;
        }

        public void setDistrict(String district) {
            this.district = district;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }

        public String getPincode() {
            return pincode;
        }

        public void setPincode(String pincode) {
            this.pincode = pincode;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public String getGovtCertificationId() {
            return govtCertificationId;
        }

        public void setGovtCertificationId(String govtCertificationId) {
            this.govtCertificationId = govtCertificationId;
        }

        public String getOrganizationName() {
            return organizationName;
        }

        public void setOrganizationName(String organizationName) {
            this.organizationName = organizationName;
        }

        public String getRunnerName() {
            return runnerName;
        }

        public void setRunnerName(String runnerName) {
            this.runnerName = runnerName;
        }
    }

    // ==============================
    // LOGIN REQUEST
    // ==============================
    public static class LoginRequest {

        private String email;
        private String password;

        public LoginRequest() {
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // ==============================
    // REQUEST ITEM DTO
    // ==============================
    public static class RequestItemDto {

        private String itemName;
        private int requiredQuantity;

        public RequestItemDto() {
        }

        public String getItemName() {
            return itemName;
        }

        public void setItemName(String itemName) {
            this.itemName = itemName;
        }

        public int getRequiredQuantity() {
            return requiredQuantity;
        }

        public void setRequiredQuantity(int requiredQuantity) {
            this.requiredQuantity = requiredQuantity;
        }
    }

    // ==============================
    // CREATE REQUEST DTO
    // ==============================
    public static class CreateRequestDto {

        private Long userId;
        private String title;
        private String category;
        private String location;
        private List<RequestItemDto> items;

        public CreateRequestDto() {
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public List<RequestItemDto> getItems() {
            return items;
        }

        public void setItems(List<RequestItemDto> items) {
            this.items = items;
        }
    }

    // ==============================
    // FULFILL REQUEST DTO
    // ==============================
    public static class FulfillRequestDto {

        private Long donorId;
        private Long requestItemId;
        private int quantity;

        public FulfillRequestDto() {
        }

        public Long getDonorId() {
            return donorId;
        }

        public void setDonorId(Long donorId) {
            this.donorId = donorId;
        }

        public Long getRequestItemId() {
            return requestItemId;
        }

        public void setRequestItemId(Long requestItemId) {
            this.requestItemId = requestItemId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }

    // ==============================
    // UPDATE USER DTO
    // ==============================
    public static class UpdateUserDto {
        private String fullName;
        private String phone;
        private String address;
        
        // Receiver specific fields
        private String govtCertificationId;
        private String organizationName;
        private String runnerName;

        public UpdateUserDto() {
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getGovtCertificationId() {
            return govtCertificationId;
        }

        public void setGovtCertificationId(String govtCertificationId) {
            this.govtCertificationId = govtCertificationId;
        }

        public String getOrganizationName() {
            return organizationName;
        }

        public void setOrganizationName(String organizationName) {
            this.organizationName = organizationName;
        }

        public String getRunnerName() {
            return runnerName;
        }

        public void setRunnerName(String runnerName) {
            this.runnerName = runnerName;
        }
    }

    // ==============================
    // CHANGE PASSWORD DTO
    // ==============================
    public static class ChangePasswordDto {
        private String currentPassword;
        private String newPassword;

        public ChangePasswordDto() {
        }

        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }

    // ==============================
    // CREATE DONATION DTO
    // ==============================
    public static class CreateDonationDto {
        private Long donorId;
        private String title;
        private String category;
        private String location;
        private List<DonationItemDto> items;

        public CreateDonationDto() {
        }

        public Long getDonorId() {
            return donorId;
        }

        public void setDonorId(Long donorId) {
            this.donorId = donorId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public List<DonationItemDto> getItems() {
            return items;
        }

        public void setItems(List<DonationItemDto> items) {
            this.items = items;
        }
    }

    public static class DonationItemDto {
        private String itemName;
        private int quantity;

        public DonationItemDto() {
        }

        public String getItemName() {
            return itemName;
        }

        public void setItemName(String itemName) {
            this.itemName = itemName;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }

    // ==============================
    // CLAIM DONATION DTO
    // ==============================
    public static class ClaimDonationDto {
        private Long receiverId;
        private Long donationItemId;
        private int quantity;

        public ClaimDonationDto() {
        }

        public Long getReceiverId() {
            return receiverId;
        }

        public void setReceiverId(Long receiverId) {
            this.receiverId = receiverId;
        }

        public Long getDonationItemId() {
            return donationItemId;
        }

        public void setDonationItemId(Long donationItemId) {
            this.donationItemId = donationItemId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }

    public static class UserResponse {

        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String address;
        private String role;
        private java.time.LocalDateTime createdAt;
        private int donationCount;

        // Detailed address fields
        private String houseNumber;
        private String streetLandmark;
        private String areaLocality;
        private String city;
        private String district;
        private String state;
        private String pincode;
        private String country;
        private String profileImageUrl;
        private java.util.List<String> galleryImages;
        
        // Receiver specific fields
        private String govtCertificationId;
        private String organizationName;
        private String runnerName;

        public UserResponse(Long id, String fullName, String email,
                String phone, String address,
                String role, java.time.LocalDateTime createdAt, int donationCount) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.phone = phone;
            this.address = address;
            this.role = role;
            this.createdAt = createdAt;
            this.donationCount = donationCount;
        }

        public Long getId() {
            return id;
        }

        public String getFullName() {
            return fullName;
        }

        public String getEmail() {
            return email;
        }

        public String getPhone() {
            return phone;
        }

        public String getAddress() {
            return address;
        }

        public String getRole() {
            return role;
        }

        public java.time.LocalDateTime getCreatedAt() {
            return createdAt;
        }

        // Getters and Setters for detailed address fields
        public String getHouseNumber() {
            return houseNumber;
        }

        public void setHouseNumber(String houseNumber) {
            this.houseNumber = houseNumber;
        }

        public String getStreetLandmark() {
            return streetLandmark;
        }

        public void setStreetLandmark(String streetLandmark) {
            this.streetLandmark = streetLandmark;
        }

        public String getAreaLocality() {
            return areaLocality;
        }

        public void setAreaLocality(String areaLocality) {
            this.areaLocality = areaLocality;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getDistrict() {
            return district;
        }

        public void setDistrict(String district) {
            this.district = district;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }

        public String getPincode() {
            return pincode;
        }

        public void setPincode(String pincode) {
            this.pincode = pincode;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public String getProfileImageUrl() {
            return profileImageUrl;
        }

        public void setProfileImageUrl(String profileImageUrl) {
            this.profileImageUrl = profileImageUrl;
        }

        public int getDonationCount() {
            return donationCount;
        }

        public void setDonationCount(int donationCount) {
            this.donationCount = donationCount;
        }

        public java.util.List<String> getGalleryImages() {
            return galleryImages;
        }

        public void setGalleryImages(java.util.List<String> galleryImages) {
            this.galleryImages = galleryImages;
        }

        public String getGovtCertificationId() {
            return govtCertificationId;
        }

        public void setGovtCertificationId(String govtCertificationId) {
            this.govtCertificationId = govtCertificationId;
        }

        public String getOrganizationName() {
            return organizationName;
        }

        public void setOrganizationName(String organizationName) {
            this.organizationName = organizationName;
        }

        public String getRunnerName() {
            return runnerName;
        }

        public void setRunnerName(String runnerName) {
            this.runnerName = runnerName;
        }
    }

    public static class ReportRequestDto {
        private Long reporterId;
        private Long reportedUserId;
        private String reason;
        private String description;

        public ReportRequestDto() {
        }

        public Long getReporterId() {
            return reporterId;
        }

        public void setReporterId(Long reporterId) {
            this.reporterId = reporterId;
        }

        public Long getReportedUserId() {
            return reportedUserId;
        }

        public void setReportedUserId(Long reportedUserId) {
            this.reportedUserId = reportedUserId;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }
}
