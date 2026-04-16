package com.donation.repository;

import com.donation.entity.Fulfillment;
import com.donation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FulfillmentRepository extends JpaRepository<Fulfillment, Long> {
    List<Fulfillment> findByRequestItemRequestReceiver(User receiver);

    List<Fulfillment> findByDonor(User donor);

    long countByStatus(com.donation.enums.FulfillmentStatus status);
}
