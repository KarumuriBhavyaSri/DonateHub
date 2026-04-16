package com.donation.repository;

import com.donation.entity.DonationClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationClaimRepository extends JpaRepository<DonationClaim, Long> {
    List<DonationClaim> findByReceiverId(Long receiverId);

    List<DonationClaim> findByDonationItem_DonationPost_DonorId(Long donorId);
}
