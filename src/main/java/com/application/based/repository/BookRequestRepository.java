package com.application.based.repository;

import com.application.based.entity.BookRequest;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {
    boolean existsByIsbn(String isbn);

    Optional<BookRequest> findByIsbn (@Pattern(regexp = "^[0-9Xx\\-]{1,20}$", message = "Invalid ISBN format") String isbn);

    @Query("SELECT br FROM BookRequest br JOIN br.requesters r WHERE r.id = :userId ORDER BY br.createdAt DESC")
    Page<BookRequest> findRecentRequestsByUser(@Param("userId") Long userId, Pageable pageable);
}
