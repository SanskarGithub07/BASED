package com.application.based.repository;

import com.application.based.entity.InvitationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface InvitationCodeRepository extends JpaRepository<InvitationCode, Long> {
    Optional<InvitationCode> findByCode(String code);
    boolean existsByCode(String code);
    long deleteByExpirationDateBeforeAndUsed(LocalDateTime date, boolean used);
}