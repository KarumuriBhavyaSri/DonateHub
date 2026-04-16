package com.donation.entity;

import com.donation.enums.ClaimStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_claim")
public class DonationClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @ManyToOne
    @JoinColumn(name = "donation_item_id", nullable = false)
    private DonationItem donationItem;

    private int quantity;

    @Enumerated(EnumType.STRING)
    private ClaimStatus status;

    private LocalDateTime claimedAt;

    public DonationClaim() {
    }

    @PrePersist
    public void onCreate() {
        claimedAt = LocalDateTime.now();
        if (status == null) {
            status = ClaimStatus.PENDING;
        }
    }

    public Long getId() {
        return id;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public DonationItem getDonationItem() {
        return donationItem;
    }

    public void setDonationItem(DonationItem donationItem) {
        this.donationItem = donationItem;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public LocalDateTime getClaimedAt() {
        return claimedAt;
    }
}
