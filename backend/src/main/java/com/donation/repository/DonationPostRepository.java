package com.donation.repository;

import com.donation.entity.DonationPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationPostRepository extends JpaRepository<DonationPost, Long> {
    List<DonationPost> findByDonorId(Long donorId);

    List<DonationPost> findByStatusNot(com.donation.enums.DonationStatus status);
}
