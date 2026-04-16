package com.donation.repository;

import com.donation.entity.Request;
import com.donation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByReceiver(User receiver);

    List<Request> findByLocationContainingIgnoreCase(String location);
    // Find all requests except those by a specific user (optional, donors usually
    // see all requests but usually not their own if they are also receivers?)
    // But Roles are strict. Donors don't create requests.
}
