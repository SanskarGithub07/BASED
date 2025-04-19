package com.application.based.repository;

import com.application.based.entity.Book;
import com.application.based.entity.Order;
import com.application.based.entity.OrderItem;
import com.application.based.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class OrderItemsRepositoryTest {

    @Autowired
    private OrderItemsRepository orderItemsRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Order item should be correctly saved and retrieved")
    void testOrderItemCrud() {
        // Given
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user);

        Order order = Order.builder()
                .sessionId("session-123")
                .totalPrice(99.99)
                .createdDate(new Date())
                .user(user)
                .build();
        orderRepository.save(order);

        Book book = Book.builder()
                .isbn("978-1234567890")
                .bookName("Test Book")
                .authorName("Test Author")
                .price(49.99)
                .quantity(10L)
                .build();
        bookRepository.save(book);

        OrderItem orderItem = OrderItem.builder()
                .order(order)
                .book(book)
                .quantity(2L)
                .price(49.99)
                .createdDate(new Date())
                .build();

        // When
        OrderItem savedItem = orderItemsRepository.save(orderItem);
        OrderItem retrievedItem = orderItemsRepository.findById(savedItem.getId()).orElse(null);

        // Then
        assertThat(retrievedItem).isNotNull();
        assertThat(retrievedItem.getQuantity()).isEqualTo(2L);
        assertThat(retrievedItem.getPrice()).isEqualTo(49.99);
        assertThat(retrievedItem.getOrder().getSessionId()).isEqualTo("session-123");
        assertThat(retrievedItem.getBook().getIsbn()).isEqualTo("978-1234567890");
    }
}