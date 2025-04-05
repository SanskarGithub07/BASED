package com.application.based.repository;

import com.application.based.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Book findByIsbn(Long isbnNumber);

    List<Book> findByAuthorNameContainingIgnoreCaseAndBookNameContainingIgnoreCase(String authorName, String bookName);

    List<Book> findByAuthorNameContainingIgnoreCase(String authorName);

    List<Book> findByBookNameContainingIgnoreCase(String bookName);
}
