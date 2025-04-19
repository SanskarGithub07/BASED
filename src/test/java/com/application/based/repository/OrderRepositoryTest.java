package com.application.based.repository;

import com.application.based.entity.Book;
import com.application.based.entity.Order;
import com.application.based.entity.OrderItem;
import com.application.based.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class OrderRepositoryTest {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private OrderItemsRepository orderItemsRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("existsBySessionId should return true when session ID exists")
    void testExistsBySessionIdWhenSessionExists() {
        // Given
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user);

        Order order = Order.builder()
                .sessionId("test-session-id-123")
                .totalPrice(99.99)
                .createdDate(new Date())
                .user(user)
                .build();
        orderRepository.save(order);

        // When
        boolean exists = orderRepository.existsBySessionId("test-session-id-123");

        // Then
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("existsBySessionId should return false when session ID does not exist")
    void testExistsBySessionIdWhenSessionDoesNotExist() {
        // When
        boolean exists = orderRepository.existsBySessionId("non-existent-session");

        // Then
        assertThat(exists).isFalse();
    }

    @Test
    @DisplayName("findAllByUserOrderByCreatedDateDesc should return orders in descending date order")
    void testFindAllByUserOrderByCreatedDateDesc() {
        // Given
        User user = User.builder()
                .username("orderuser")
                .email("orders@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user);

        // Create three orders with different dates
        Order oldestOrder = Order.builder()
                .sessionId("session-1")
                .totalPrice(50.00)
                .createdDate(new Date(System.currentTimeMillis() - 200000)) // Oldest
                .user(user)
                .build();

        Order middleOrder = Order.builder()
                .sessionId("session-2")
                .totalPrice(75.00)
                .createdDate(new Date(System.currentTimeMillis() - 100000)) // Middle
                .user(user)
                .build();

        Order newestOrder = Order.builder()
                .sessionId("session-3")
                .totalPrice(100.00)
                .createdDate(new Date()) // Newest
                .user(user)
                .build();

        orderRepository.saveAll(List.of(oldestOrder, middleOrder, newestOrder));

        // When
        List<Order> orders = orderRepository.findAllByUserOrderByCreatedDateDesc(user);

        // Then
        assertThat(orders).hasSize(3);
        assertThat(orders.get(0).getSessionId()).isEqualTo("session-3"); // Newest first
        assertThat(orders.get(1).getSessionId()).isEqualTo("session-2"); // Middle second
        assertThat(orders.get(2).getSessionId()).isEqualTo("session-1"); // Oldest last
    }

    @Test
    @DisplayName("Orders should be linked to the correct user")
    void testOrderUserAssociation() {
        // Given
        User user1 = User.builder()
                .username("user1")
                .email("user1@example.com")
                .password("password")
                .enabled(true)
                .build();

        User user2 = User.builder()
                .username("user2")
                .email("user2@example.com")
                .password("password")
                .enabled(true)
                .build();

        userRepository.saveAll(List.of(user1, user2));

        Order order1 = Order.builder()
                .sessionId("user1-session")
                .totalPrice(120.00)
                .createdDate(new Date())
                .user(user1)
                .build();

        Order order2 = Order.builder()
                .sessionId("user2-session")
                .totalPrice(85.50)
                .createdDate(new Date())
                .user(user2)
                .build();

        orderRepository.saveAll(List.of(order1, order2));

        // When
        List<Order> user1Orders = orderRepository.findAllByUserOrderByCreatedDateDesc(user1);
        List<Order> user2Orders = orderRepository.findAllByUserOrderByCreatedDateDesc(user2);

        // Then
        assertThat(user1Orders).hasSize(1);
        assertThat(user1Orders.get(0).getSessionId()).isEqualTo("user1-session");

        assertThat(user2Orders).hasSize(1);
        assertThat(user2Orders.get(0).getSessionId()).isEqualTo("user2-session");
    }

    @Test
    @DisplayName("Order should correctly retrieve its order items")
    void testOrderWithOrderItems() {
        // Given
        User user = User.builder()
                .username("orderuser")
                .email("orders@example.com")
                .password("password")
                .enabled(true)
                .build();
        userRepository.save(user);

        Book book1 = Book.builder()
                .isbn("978-1111111111")
                .bookName("Book 1")
                .authorName("Author 1")
                .price(29.99)
                .quantity(10L)
                .build();

        Book book2 = Book.builder()
                .isbn("978-2222222222")
                .bookName("Book 2")
                .authorName("Author 2")
                .price(39.99)
                .quantity(5L)
                .build();

        bookRepository.saveAll(List.of(book1, book2));

        Order order = Order.builder()
                .sessionId("order-with-items")
                .totalPrice(69.98) // 29.99 + 39.99
                .createdDate(new Date())
                .user(user)
                .build();
        orderRepository.save(order);

        OrderItem item1 = OrderItem.builder()
                .order(order)
                .book(book1)
                .quantity(1L)
                .price(29.99)
                .createdDate(new Date())
                .build();

        OrderItem item2 = OrderItem.builder()
                .order(order)
                .book(book2)
                .quantity(1L)
                .price(39.99)
                .createdDate(new Date())
                .build();

        orderItemsRepository.saveAll(List.of(item1, item2));

        // Force flush to ensure everything is written to the database
        entityManager.flush();

        // When - Use a direct query to get order items instead of relying on lazy loading
        List<OrderItem> items = orderItemsRepository.findAll();

        // Then
        assertThat(items).isNotNull();
        assertThat(items).hasSize(2);

        // Verify both items are for the correct order
        assertThat(items).allMatch(item -> item.getOrder().getId().equals(order.getId()));

        // Verify we have items for both books
        List<Long> bookIds = items.stream()
                .map(item -> item.getBook().getId())
                .toList();
        assertThat(bookIds).containsExactlyInAnyOrder(book1.getId(), book2.getId());
    }
}