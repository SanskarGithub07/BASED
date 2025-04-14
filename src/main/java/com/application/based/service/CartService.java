package com.application.based.service;

import com.application.based.entity.Book;
import com.application.based.entity.User;
import com.application.based.model.cart.AddToCartDto;
import org.springframework.stereotype.Service;

@Service
public interface CartService {
    void addToCart(AddToCartDto addToCartDto, Book book, User user);
}
