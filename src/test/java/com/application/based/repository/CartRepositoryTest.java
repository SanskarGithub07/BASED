package com.application.based.repository;

import com.application.based.entity.Book;
import com.application.based.entity.Cart;
import com.application.based.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

@DataJpaTest
class CartRepositoryTest {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Test
    @DisplayName("findByUserOrderByCreatedDateDesc should return items in correct order")
    void testFindByUserOrderByCreatedDateDesc() {
        // Given
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .enabled(true)
                .build();
        userRepository.save(user);

        Book book1 = Book.builder()
                .isbn("978-1111111111")
                .bookName("Book 1")
                .authorName("Author 1")
                .quantity(10L)
                .build();

        Book book2 = Book.builder()
                .isbn("978-2222222222")
                .bookName("Book 2")
                .authorName("Author 2")
                .quantity(5L)
                .build();

        bookRepository.saveAll(List.of(book1, book2));

        // Create carts with specific dates (older first)
        Cart cart1 = Cart.builder()
                .user(user)
                .book(book1)
                .quantity(2L)
                .createdDate(new Date(System.currentTimeMillis() - 100000)) // Older
                .build();

        Cart cart2 = Cart.builder()
                .user(user)
                .book(book2)
                .quantity(1L)
                .createdDate(new Date(System.currentTimeMillis())) // Newer
                .build();

        cartRepository.saveAll(List.of(cart1, cart2));

        // When
        List<Cart> carts = cartRepository.findByUserOrderByCreatedDateDesc(user);

        // Then
        assertThat(carts).hasSize(2);
        assertThat(carts.get(0).getBook().getIsbn()).isEqualTo("978-2222222222"); // Newest first
        assertThat(carts.get(1).getBook().getIsbn()).isEqualTo("978-1111111111"); // Oldest second
    }

    @Test
    @DisplayName("deleteByUser should remove all items for a user")
    void testDeleteByUser() {
        // Given
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .enabled(true)
                .build();
        userRepository.save(user);

        Book book = Book.builder()
                .isbn("978-1111111111")
                .bookName("Test Book")
                .authorName("Test Author")
                .quantity(10L)
                .build();
        bookRepository.save(book);

        Cart cart = Cart.builder()
                .user(user)
                .book(book)
                .quantity(3L)
                .build();
        cartRepository.save(cart);

        // When
        cartRepository.deleteByUser(user);

        // Then
        List<Cart> remainingCarts = cartRepository.findByUserOrderByCreatedDateDesc(user);
        assertThat(remainingCarts).isEmpty();
    }

    @Test
    @DisplayName("Unique constraint should prevent duplicate user-book combinations")
    void testUniqueConstraint() {
        // Given
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .enabled(true)
                .build();
        userRepository.save(user);

        Book book = Book.builder()
                .isbn("978-1111111111")
                .bookName("Test Book")
                .authorName("Test Author")
                .quantity(10L)
                .build();
        bookRepository.save(book);

        Cart cart1 = Cart.builder()
                .user(user)
                .book(book)
                .quantity(1L)
                .build();
        cartRepository.save(cart1);

        // When & Then
        Cart cart2 = Cart.builder()
                .user(user)
                .book(book)
                .quantity(2L)
                .build();

        assertThatExceptionOfType(DataIntegrityViolationException.class)
                .isThrownBy(() -> cartRepository.save(cart2))
                .withMessageContaining("constraint");
    }
}