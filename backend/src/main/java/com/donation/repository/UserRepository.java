package com.donation.repository;

import com.donation.entity.User;
import com.donation.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    long countByRole(Role role);

    java.util.List<User> findAllByRole(Role role);
}
