package com.application.based.repository;

import com.application.based.entity.Cart;
import com.application.based.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserOrderByCreatedDateDesc(User user);
}
