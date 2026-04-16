package com.donation.entity;

import com.donation.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    @JsonIgnore
    private String password;
    private String phone;
    private String address;

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

    private LocalDateTime createdAt;

    private int donationCount = 0;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_gallery", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "image_url")
    private java.util.List<String> galleryImages = new java.util.ArrayList<>();

    // Receiver specific fields
    private String govtCertificationId;
    private String organizationName;
    private String runnerName;
    private int reportCount = 0;
    private boolean blocked = false;

    @Enumerated(EnumType.STRING)
    private Role role;

    public User() {
    }

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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

    public int getReportCount() {
        return reportCount;
    }

    public void setReportCount(int reportCount) {
        this.reportCount = reportCount;
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }
}
