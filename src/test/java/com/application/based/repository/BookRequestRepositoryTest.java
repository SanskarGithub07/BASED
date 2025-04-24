package com.application.based.repository;

import com.application.based.entity.BookRequest;
import com.application.based.entity.User;
import com.application.based.model.RequestStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class BookRequestRepositoryTest {

    @Autowired
    private BookRequestRepository bookRequestRepository;

    @Autowired
    private UserRepository userRepository; // Assuming you have this repository

    @Test
    @DisplayName("existsByIsbn should return true when ISBN exists")
    void testExistsByIsbnWhenIsbnExists() {
        // Given
        BookRequest bookRequest = BookRequest.builder()
                .bookName("Test Book")
                .authorName("Test Author")
                .isbn("978-1234567890")
                .quantity(5L)
                .status(RequestStatus.PENDING)
                .build();
        bookRequestRepository.save(bookRequest);

        // When
        boolean exists = bookRequestRepository.existsByIsbn("978-1234567890");

        // Then
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("existsByIsbn should return false when ISBN does not exist")
    void testExistsByIsbnWhenIsbnDoesNotExist() {
        // When
        boolean exists = bookRequestRepository.existsByIsbn("non-existent-isbn");

        // Then
        assertThat(exists).isFalse();
    }

    @Test
    @DisplayName("findByIsbn should return the book request when ISBN exists")
    void testFindByIsbnWhenIsbnExists() {
        // Given
        BookRequest bookRequest = BookRequest.builder()
                .bookName("Test Book")
                .authorName("Test Author")
                .isbn("978-1234567890")
                .quantity(5L)
                .additionalNotes("This is a test request")
                .status(RequestStatus.PENDING)
                .build();
        bookRequestRepository.save(bookRequest);

        // When
        Optional<BookRequest> found = bookRequestRepository.findByIsbn("978-1234567890");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getBookName()).isEqualTo("Test Book");
        assertThat(found.get().getAuthorName()).isEqualTo("Test Author");
        assertThat(found.get().getQuantity()).isEqualTo(5L);
    }

    @Test
    @DisplayName("findByIsbn should return empty when ISBN doesn't exist")
    void testFindByIsbnWhenIsbnDoesNotExist() {
        // When
        Optional<BookRequest> found = bookRequestRepository.findByIsbn("non-existent-isbn");

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("BookRequest with requesters should be saved and retrieved correctly")
    void testBookRequestWithRequesters() {
        // Given
        // Create and save a user first
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user);

        // Create a book request with this user as a requester
        Set<User> requesters = new HashSet<>();
        requesters.add(user);

        BookRequest bookRequest = BookRequest.builder()
                .bookName("Requested Book")
                .authorName("Requested Author")
                .isbn("978-9876543210")
                .quantity(3L)
                .requesters(requesters)
                .status(RequestStatus.PENDING)
                .build();
        bookRequestRepository.save(bookRequest);

        // When
        Optional<BookRequest> found = bookRequestRepository.findById(bookRequest.getId());

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getRequesters()).hasSize(1);
        assertThat(found.get().getRequesters().iterator().next().getUsername()).isEqualTo("testuser");
    }
}