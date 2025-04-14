package com.application.based.repository;

import com.application.based.entity.BlacklistedJWTToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlacklistedJWTTokenRepository extends JpaRepository<BlacklistedJWTToken, String> {
    boolean existsByToken(String token);
}
