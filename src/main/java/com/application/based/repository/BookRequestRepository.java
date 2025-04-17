package com.application.based.repository;

import com.application.based.entity.BookRequest;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {
    boolean existsByIsbn(String isbn);

    Optional<BookRequest> findByIsbn (@Pattern(regexp = "^[0-9Xx\\-]{1,20}$", message = "Invalid ISBN format") String isbn);

//    @Query("SELECT DISTINCT br FROM BookRequest br JOIN br.requesters r WHERE r.id = :userId ORDER BY br.createdAt DESC")
//    Page<BookRequest> findByRequesterId(@Param("userId") Long userId, Pageable pageable);
}
