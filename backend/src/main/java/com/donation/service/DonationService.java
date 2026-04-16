package com.donation.service;

import com.donation.dto.Dtos;
import com.donation.entity.*;
import com.donation.enums.ClaimStatus;
import com.donation.exception.ResourceNotFoundException;
import com.donation.repository.DonationClaimRepository;
import com.donation.repository.DonationItemRepository;
import com.donation.repository.DonationPostRepository;
import com.donation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DonationService {

    @Autowired
    private DonationPostRepository donationPostRepository;

    @Autowired
    private DonationItemRepository donationItemRepository;

    @Autowired
    private DonationClaimRepository donationClaimRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public DonationPost createDonationPost(Dtos.CreateDonationDto dto) {
        User donor = userRepository.findById(dto.getDonorId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found"));

        DonationPost post = new DonationPost();
        post.setDonor(donor);
        post.setTitle(dto.getTitle());
        post.setCategory(dto.getCategory());
        post.setLocation(dto.getLocation());

        for (Dtos.DonationItemDto itemDto : dto.getItems()) {
            DonationItem item = new DonationItem();
            item.setItemName(itemDto.getItemName());
            item.setQuantity(itemDto.getQuantity());
            post.addItem(item);
        }

        DonationPost savedPost = donationPostRepository.save(post);

        // Notify receivers
        try {
            java.util.List<User> receivers = userRepository.findAllByRole(com.donation.enums.Role.RECEIVER);
            emailService.notifyReceiversOfNewDonation(savedPost, receivers);
        } catch (Exception e) {
            System.err.println("Notification failed: " + e.getMessage());
        }

        return savedPost;
    }

    public List<DonationPost> getAllDonationPosts() {
        return donationPostRepository.findAll();
    }

    public List<DonationPost> getDonationPostsByDonor(Long donorId) {
        return donationPostRepository.findByDonorId(donorId);
    }

    public DonationPost getDonationPost(Long id) {
        return donationPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation post not found"));
    }

    @Transactional
    public DonationClaim claimDonationItem(Dtos.ClaimDonationDto dto) {
        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        DonationItem item = donationItemRepository.findById(dto.getDonationItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Donation item not found"));

        if (item.getQuantity() - item.getClaimedQuantity() < dto.getQuantity()) {
            throw new IllegalArgumentException("Not enough items available to claim");
        }

        DonationClaim claim = new DonationClaim();
        claim.setReceiver(receiver);
        claim.setDonationItem(item);
        claim.setQuantity(dto.getQuantity());

        item.addClaimedQuantity(dto.getQuantity());
        item.getDonationPost().updateStatus();

        donationItemRepository.save(item);
        return donationClaimRepository.save(claim);
    }

    @Transactional
    public void deleteDonationPost(Long postId) {
        DonationPost post = donationPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation post not found"));
        // Allow deletion even when claims exist — frontend shows a warning popup for consent
        donationPostRepository.delete(post);
    }

    public boolean donationPostHasClaims(Long postId) {
        DonationPost post = donationPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation post not found"));
        return post.getItems().stream().anyMatch(item -> item.getClaimedQuantity() > 0);
    }

    public List<DonationClaim> getClaimsByReceiver(Long receiverId) {
        return donationClaimRepository.findByReceiverId(receiverId);
    }

    public List<DonationClaim> getClaimsByDonor(Long donorId) {
        return donationClaimRepository.findByDonationItem_DonationPost_DonorId(donorId);
    }

    @Transactional
    public DonationClaim updateClaimStatus(Long claimId, ClaimStatus status) {
        DonationClaim claim = donationClaimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        // If the claim is rejected, release the claimed quantity back to the item
        if (status == ClaimStatus.REJECTED && claim.getStatus() != ClaimStatus.REJECTED) {
            DonationItem item = claim.getDonationItem();
            item.setClaimedQuantity(item.getClaimedQuantity() - claim.getQuantity());
            item.getDonationPost().updateStatus();
            donationItemRepository.save(item);
        }

        if (status == ClaimStatus.COMPLETED && claim.getStatus() != ClaimStatus.COMPLETED) {
            User donor = claim.getDonationItem().getDonationPost().getDonor();
            donor.setDonationCount(donor.getDonationCount() + 1);
            userRepository.save(donor);
        } else if (claim.getStatus() == ClaimStatus.COMPLETED && status != ClaimStatus.COMPLETED) {
            User donor = claim.getDonationItem().getDonationPost().getDonor();
            donor.setDonationCount(Math.max(0, donor.getDonationCount() - 1));
            userRepository.save(donor);
        }

        claim.setStatus(status);
        return donationClaimRepository.save(claim);
    }
}
