package com.donation.service;

import com.donation.dto.Dtos;
import com.donation.entity.*;
import com.donation.enums.RequestStatus;
import com.donation.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private RequestItemRepository requestItemRepository;

    @Autowired
    private FulfillmentRepository fulfillmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public Request createRequest(Dtos.CreateRequestDto dto) {

        User receiver = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Request request = new Request();
        request.setReceiver(receiver);
        request.setTitle(dto.getTitle());
        request.setCategory(dto.getCategory());
        request.setLocation(dto.getLocation());
        request.setStatus(RequestStatus.OPEN);

        for (Dtos.RequestItemDto itemDto : dto.getItems()) {

            RequestItem item = new RequestItem();
            item.setItemName(itemDto.getItemName());
            item.setRequiredQuantity(itemDto.getRequiredQuantity());
            item.setFulfilledQuantity(0);

            request.addItem(item);
        }

        Request savedRequest = requestRepository.save(request);

        // Notify donors
        try {
            java.util.List<User> donors = userRepository.findAllByRole(com.donation.enums.Role.DONOR);
            emailService.notifyDonorsOfNewRequest(savedRequest, donors);
        } catch (Exception e) {
            System.err.println("Notification failed: " + e.getMessage());
        }

        return savedRequest;
    }

    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<Request> getRequestsByReceiver(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByReceiver(user);
    }

    public Request getRequest(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }

    @Transactional
    public void deleteRequest(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        boolean hasAnyFulfillment = request.getItems().stream()
                .anyMatch(item -> item.getFulfilledQuantity() > 0);

        if (hasAnyFulfillment) {
            throw new IllegalStateException("Cannot delete a request that already has donations. Use Close Need instead.");
        }

        requestRepository.delete(request);
    }

    @Transactional
    public Request closeRequest(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() == RequestStatus.COMPLETED) {
            throw new IllegalStateException("This request is already completed.");
        }

        request.setStatus(RequestStatus.COMPLETED);
        return requestRepository.save(request);
    }

    @Transactional
    public Fulfillment fulfillRequest(Dtos.FulfillRequestDto dto) {

        User donor = userRepository.findById(dto.getDonorId())
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        RequestItem item = requestItemRepository.findById(dto.getRequestItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (item.getFulfilledQuantity() + dto.getQuantity() > item.getRequiredQuantity()) {
            throw new RuntimeException("Quantity exceeds required amount");
        }

        item.setFulfilledQuantity(
                item.getFulfilledQuantity() + dto.getQuantity());

        requestItemRepository.save(item);

        Fulfillment fulfillment = new Fulfillment();
        fulfillment.setDonor(donor);
        fulfillment.setRequestItem(item);
        fulfillment.setQuantity(dto.getQuantity());
        fulfillment.setStatus(com.donation.enums.FulfillmentStatus.PENDING);

        updateRequestStatus(item.getRequest());

        return fulfillmentRepository.save(fulfillment);
    }

    private void updateRequestStatus(Request request) {

        boolean allCompleted = true;
        boolean anyStarted = false;

        for (RequestItem item : request.getItems()) {
            if (item.getFulfilledQuantity() > 0) {
                anyStarted = true;
            }
            if (item.getFulfilledQuantity() < item.getRequiredQuantity()) {
                allCompleted = false;
            }
        }

        if (allCompleted) {
            request.setStatus(RequestStatus.COMPLETED);
        } else if (anyStarted) {
            request.setStatus(RequestStatus.PARTIALLY_FULFILLED);
        } else {
            request.setStatus(RequestStatus.OPEN);
        }

        requestRepository.save(request);
    }

    public List<Fulfillment> getFulfillmentsByReceiver(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return fulfillmentRepository.findByRequestItemRequestReceiver(user);
    }

    public List<Fulfillment> getFulfillmentsByDonor(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return fulfillmentRepository.findByDonor(user);
    }

    @Transactional
    public Fulfillment updateFulfillmentStatus(Long fulfillmentId, com.donation.enums.FulfillmentStatus status) {
        Fulfillment fulfillment = fulfillmentRepository.findById(fulfillmentId)
                .orElseThrow(() -> new RuntimeException("Fulfillment not found"));

        if (status == com.donation.enums.FulfillmentStatus.DELIVERED
                && fulfillment.getStatus() != com.donation.enums.FulfillmentStatus.DELIVERED) {
            User donor = fulfillment.getDonor();
            donor.setDonationCount(donor.getDonationCount() + 1);
            userRepository.save(donor);
        } else if (fulfillment.getStatus() == com.donation.enums.FulfillmentStatus.DELIVERED
                && status != com.donation.enums.FulfillmentStatus.DELIVERED) {
            User donor = fulfillment.getDonor();
            donor.setDonationCount(Math.max(0, donor.getDonationCount() - 1));
            userRepository.save(donor);
        }

        fulfillment.setStatus(status);
        return fulfillmentRepository.save(fulfillment);
    }

    public long getTotalDonationCount() {
        return fulfillmentRepository.count();
    }

    public long getDeliveredDonationCount() {
        return fulfillmentRepository.countByStatus(com.donation.enums.FulfillmentStatus.DELIVERED);
    }

}
