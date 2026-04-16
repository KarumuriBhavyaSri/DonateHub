package com.donation.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "donation_item")
public class DonationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donation_post_id", nullable = false)
    private DonationPost donationPost;

    private String itemName;
    private int quantity;
    private int claimedQuantity = 0;

    public DonationItem() {
    }

    public Long getId() {
        return id;
    }

    public DonationPost getDonationPost() {
        return donationPost;
    }

    public void setDonationPost(DonationPost donationPost) {
        this.donationPost = donationPost;
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

    public int getClaimedQuantity() {
        return claimedQuantity;
    }

    public void setClaimedQuantity(int claimedQuantity) {
        this.claimedQuantity = claimedQuantity;
    }

    public void addClaimedQuantity(int quantity) {
        this.claimedQuantity += quantity;
    }

    public boolean isFullyClaimed() {
        return this.claimedQuantity >= this.quantity;
    }
}
