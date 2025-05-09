package com.application.based.repository;

import com.application.based.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String emailId);

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

}
