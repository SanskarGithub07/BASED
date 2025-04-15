package com.application.based.service;

import com.application.based.entity.Book;
import com.application.based.entity.Cart;
import com.application.based.entity.User;
import com.application.based.model.cart.AddToCartDto;
import com.application.based.model.cart.CartDto;
import com.application.based.model.cart.CartItemDto;
import com.application.based.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

    @Override
    public CartDto listCartItems(User user) {

        List<Cart> cartList = cartRepository.findByUserOrderByCreatedDateDesc(user);
        List<CartItemDto> cartItems = new ArrayList<>();
        for(Cart cart: cartList){
            CartItemDto cartItemDto = getDtoFromCart(cart);
            cartItems.add(cartItemDto);
        }

        Double totalCost = 0.0;

        for(CartItemDto cartItemDto : cartItems){
            totalCost += cartItemDto.getBook().getPrice() * cartItemDto.getQuantity();
        }

        return CartDto.builder()
                .cartItems(cartItems)
                .totalCost(totalCost)
                .build();
    }

    @Override
    public void updateCartItem(Long quantity, User user, Long itemId) {
        Cart cart = cartRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found."));

        if(!cart.getUser().getId().equals(user.getId())){
            throw new RuntimeException("Unauthorized to update this cart item.");
        }
        if(quantity > cart.getBook().getQuantity()){
            throw new RuntimeException("Book quantity exceeds the amount available in the database");
        }
        cart.setQuantity(quantity);
        cart.setCreatedDate(new Date());
        cartRepository.save(cart);
    }

    @Override
    public void deleteCartItem(Long itemId, User user){
        Cart cart = cartRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if(!cart.getUser().getId().equals(user.getId())){
            throw new RuntimeException("Unauthorized to delete this cart item.");
        }
        cartRepository.delete(cart);
    }

    @Override
    public CartItemDto getDtoFromCart(Cart cart){
        return CartItemDto.builder()
                .book(cart.getBook())
                .quantity(cart.getQuantity())
                .id(cart.getId())
                .build();
    }
}
