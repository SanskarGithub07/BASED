package com.application.based.service;

import com.application.based.entity.Book;
import com.application.based.entity.Cart;
import com.application.based.entity.User;
import com.application.based.model.cart.AddToCartDto;
import com.application.based.model.cart.CartDto;
import com.application.based.model.cart.CartItemDto;
import org.springframework.stereotype.Service;

@Service
public interface CartService {
    void addToCart(AddToCartDto addToCartDto, Book book, User user);

    CartDto listCartItems(User user);

    void updateCartItem(Long quantity, User user, Long itemId);

    CartItemDto getDtoFromCart(Cart cart);

    void deleteCartItem(Long itemId, User user);

    void deleteUserCartItems(User user);
}
