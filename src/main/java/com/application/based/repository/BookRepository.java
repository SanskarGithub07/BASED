package com.application.based.repository;

import com.application.based.entity.Book;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
    Optional<Book> findByIsbn(String isbnNumber);

    List<Book> findByAuthorNameContainingIgnoreCaseAndBookNameContainingIgnoreCase(String authorName, String bookName);

    List<Book> findByAuthorNameContainingIgnoreCase(String authorName);

    List<Book> findByBookNameContainingIgnoreCase(String bookName);

    List<Book> findAll(Specification<Book> specification);
}
