package com.application.based.repository;

import com.application.based.entity.Order;
import com.application.based.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    boolean existsBySessionId(String sessionId);

    List<Order> findAllByUserOrderByCreatedDateDesc(User user);
}
