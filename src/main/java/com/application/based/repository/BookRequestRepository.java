package com.application.based.repository;

import com.application.based.entity.BookRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {
    boolean existsByIsbn(String isbn);
}
