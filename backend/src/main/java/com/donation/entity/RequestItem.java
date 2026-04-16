package com.donation.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "request_item")
public class RequestItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;

    private int requiredQuantity;

    private int fulfilledQuantity;

    @ManyToOne
    @JoinColumn(name = "request_id")
    @JsonIgnoreProperties("items")
    private Request request;

    public RequestItem() {
    }

    public Long getId() {
        return id;
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
        if (requiredQuantity <= 0)
            throw new IllegalArgumentException("Required quantity must be positive");
        this.requiredQuantity = requiredQuantity;
    }

    public int getFulfilledQuantity() {
        return fulfilledQuantity;
    }

    // 🔥 THIS METHOD WAS MISSING
    public void setFulfilledQuantity(int fulfilledQuantity) {
        if (fulfilledQuantity < 0)
            throw new IllegalArgumentException("Fulfilled quantity cannot be negative");
        this.fulfilledQuantity = fulfilledQuantity;
    }

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
    }

    // Optional helper
    public void fulfill(int quantity) {
        if (quantity <= 0)
            throw new IllegalArgumentException("Quantity must be positive");

        if (fulfilledQuantity + quantity > requiredQuantity)
            throw new RuntimeException("Quantity exceeds required amount");

        this.fulfilledQuantity += quantity;

        if (request != null) {
            request.updateStatus();
        }
    }

    public boolean isCompleted() {
        return fulfilledQuantity >= requiredQuantity;
    }
}
