package com.donation.entity;

import com.donation.enums.DonationStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "donation_post")
public class DonationPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;

    private String title;
    private String category;
    private String location;

    @Enumerated(EnumType.STRING)
    private DonationStatus status;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "donationPost", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("donationPost")
    private List<DonationItem> items = new ArrayList<>();

    public DonationPost() {
    }

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null)
            status = DonationStatus.OPEN;
    }

    public Long getId() {
        return id;
    }

    public User getDonor() {
        return donor;
    }

    public void setDonor(User donor) {
        this.donor = donor;
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

    public DonationStatus getStatus() {
        return status;
    }

    public void setStatus(DonationStatus status) {
        this.status = status;
    }

    public List<DonationItem> getItems() {
        return items;
    }

    public void addItem(DonationItem item) {
        item.setDonationPost(this);
        items.add(item);
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void updateStatus() {
        boolean allClaimed = true;
        boolean anyClaimed = false;

        for (DonationItem item : items) {
            if (item.getClaimedQuantity() > 0) {
                anyClaimed = true;
            }
            if (!item.isFullyClaimed()) {
                allClaimed = false;
            }
        }

        if (allClaimed) {
            status = DonationStatus.CLOSED;
        } else if (anyClaimed) {
            status = DonationStatus.PARTIALLY_CLAIMED;
        } else {
            status = DonationStatus.OPEN;
        }
    }
}
