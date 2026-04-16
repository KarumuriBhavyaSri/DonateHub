package com.donation.entity;

import com.donation.enums.FulfillmentStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fulfillment")
public class Fulfillment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    private LocalDateTime fulfilledAt;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private User donor;

    @ManyToOne
    @JoinColumn(name = "request_item_id")
    private RequestItem requestItem;

    @Enumerated(EnumType.STRING)
    private FulfillmentStatus status;

    public Fulfillment() {
    }

    @PrePersist
    public void onCreate() {
        fulfilledAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = FulfillmentStatus.PENDING;
        }
    }

    public Long getId() {
        return id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        if (quantity <= 0)
            throw new IllegalArgumentException("Quantity must be positive");
        this.quantity = quantity;
    }

    public LocalDateTime getFulfilledAt() {
        return fulfilledAt;
    }

    public FulfillmentStatus getStatus() {
        return status;
    }

    public void setStatus(FulfillmentStatus status) {
        this.status = status;
    }

    public User getDonor() {
        return donor;
    }

    public void setDonor(User donor) {
        this.donor = donor;
    }

    public RequestItem getRequestItem() {
        return requestItem;
    }

    public void setRequestItem(RequestItem requestItem) {
        this.requestItem = requestItem;
    }
}
