package com.application.based.repository;

import com.application.based.entity.Book;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class BookRepositoryTest {

    @Autowired
    private BookRepository bookRepository;

    @Test
    @DisplayName("findByIsbn should return book when ISBN exists")
    void testFindByIsbnWhenIsbnExists() {
        // Given
        Book book = Book.builder()
                .isbn("978-0-13-516630-7")
                .authorName("Robert Martin")
                .bookName("Clean Code")
                .price(45.99)
                .quantity(10L)
                .publicationYear(LocalDate.of(2008, 8, 1))
                .availability("IN_STOCK")
                .publisher("Prentice Hall")
                .build();
        bookRepository.save(book);

        // When
        Optional<Book> found = bookRepository.findByIsbn("978-0-13-516630-7");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getBookName()).isEqualTo("Clean Code");
        assertThat(found.get().getAuthorName()).isEqualTo("Robert Martin");
    }

    @Test
    @DisplayName("findByIsbn should return empty when ISBN doesn't exist")
    void testFindByIsbnWhenIsbnDoesNotExist() {
        // When
        Optional<Book> found = bookRepository.findByIsbn("non-existent-isbn");

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("findByAuthorNameContainingIgnoreCase should return books by author")
    void testFindByAuthorNameContainingIgnoreCase() {
        // Given
        Book book1 = Book.builder()
                .isbn("978-0-13-516630-7")
                .authorName("Robert Martin")
                .bookName("Clean Code")
                .price(45.99)
                .quantity(10L)
                .build();

        Book book2 = Book.builder()
                .isbn("978-0-13-235088-4")
                .authorName("Robert Martin")
                .bookName("Clean Architecture")
                .price(39.99)
                .quantity(5L)
                .build();

        Book book3 = Book.builder()
                .isbn("978-0-321-12521-5")
                .authorName("Another Author")
                .bookName("Some Book")
                .price(29.99)
                .quantity(3L)
                .build();

        bookRepository.saveAll(List.of(book1, book2, book3));

        // When - Case insensitive search
        List<Book> foundBooks = bookRepository.findByAuthorNameContainingIgnoreCase("robert");

        // Then
        assertThat(foundBooks).hasSize(2);
        assertThat(foundBooks).extracting(Book::getIsbn).containsExactlyInAnyOrder(
                "978-0-13-516630-7", "978-0-13-235088-4");
    }

    @Test
    @DisplayName("findByBookNameContainingIgnoreCase should return books by name")
    void testFindByBookNameContainingIgnoreCase() {
        // Given
        Book book1 = Book.builder()
                .isbn("978-0-13-516630-7")
                .authorName("Robert Martin")
                .bookName("Clean Code")
                .price(45.99)
                .quantity(10L)
                .build();

        Book book2 = Book.builder()
                .isbn("978-0-13-235088-4")
                .authorName("Robert Martin")
                .bookName("Clean Architecture")
                .price(39.99)
                .quantity(5L)
                .build();

        bookRepository.saveAll(List.of(book1, book2));

        // When - Case insensitive search
        List<Book> foundBooks = bookRepository.findByBookNameContainingIgnoreCase("clean");

        // Then
        assertThat(foundBooks).hasSize(2);
        assertThat(foundBooks).extracting(Book::getBookName)
                .containsExactlyInAnyOrder("Clean Code", "Clean Architecture");
    }

    @Test
    @DisplayName("findByAuthorNameContainingIgnoreCaseAndBookNameContainingIgnoreCase should filter by both")
    void testFindByAuthorNameAndBookName() {
        // Given
        Book book1 = Book.builder()
                .isbn("978-0-13-516630-7")
                .authorName("Robert Martin")
                .bookName("Clean Code")
                .price(45.99)
                .quantity(10L)
                .build();

        Book book2 = Book.builder()
                .isbn("978-0-13-235088-4")
                .authorName("Robert Martin")
                .bookName("Clean Architecture")
                .price(39.99)
                .quantity(5L)
                .build();

        Book book3 = Book.builder()
                .isbn("978-0-321-12521-5")
                .authorName("Martin Fowler")
                .bookName("Refactoring")
                .price(49.99)
                .quantity(8L)
                .build();

        bookRepository.saveAll(List.of(book1, book2, book3));

        // When
        List<Book> foundBooks = bookRepository.findByAuthorNameContainingIgnoreCaseAndBookNameContainingIgnoreCase(
                "martin", "clean");

        // Then
        assertThat(foundBooks).hasSize(2);
        assertThat(foundBooks).extracting(Book::getIsbn)
                .containsExactlyInAnyOrder("978-0-13-516630-7", "978-0-13-235088-4");
    }
}