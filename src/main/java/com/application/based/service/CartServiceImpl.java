package com.application.based.service;

import com.application.based.entity.Book;
import com.application.based.entity.Cart;
import com.application.based.entity.User;
import com.application.based.model.cart.AddToCartDto;
import com.application.based.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService{

    @Autowired
    private CartRepository cartRepository;

    @Override
    public void addToCart(AddToCartDto addToCartDto, Book book, User user) {
        Cart cart = Cart.builder()
                .book(book)
                .user(user)
                .quantity(addToCartDto.getQuantity())
                .build();

        cartRepository.save(cart);
    }
}
