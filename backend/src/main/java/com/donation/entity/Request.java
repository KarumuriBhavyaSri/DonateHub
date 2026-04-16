package com.donation.entity;

import com.donation.enums.RequestStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "request")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User receiver;

    private String title;
    private String category;
    private String location;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("request")
    private List<RequestItem> items = new ArrayList<>();

    public Request() {
    }

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null)
            status = RequestStatus.OPEN;
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

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public List<RequestItem> getItems() {
        return items;
    }

    public void addItem(RequestItem item) {
        item.setRequest(this);
        items.add(item);
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // 🔥 Business Logic Here
    public void updateStatus() {

        boolean allCompleted = true;
        boolean anyStarted = false;

        for (RequestItem item : items) {

            if (item.getFulfilledQuantity() > 0) {
                anyStarted = true;
            }

            if (!item.isCompleted()) {
                allCompleted = false;
            }
        }

        if (allCompleted) {
            status = RequestStatus.COMPLETED;
        } else if (anyStarted) {
            status = RequestStatus.PARTIALLY_FULFILLED;
        } else {
            status = RequestStatus.OPEN;
        }
    }
}
