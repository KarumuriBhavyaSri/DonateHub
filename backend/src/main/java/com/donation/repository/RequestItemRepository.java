package com.donation.repository;

import com.donation.entity.RequestItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestItemRepository extends JpaRepository<RequestItem, Long> {
}
