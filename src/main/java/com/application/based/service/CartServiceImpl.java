package com.application.based.service;

import com.application.based.entity.Book;
import com.application.based.entity.Cart;
import com.application.based.entity.User;
import com.application.based.model.cart.AddToCartDto;
import com.application.based.model.cart.CartDto;
import com.application.based.model.cart.CartItemDto;
import com.application.based.repository.CartRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Override
    public void addToCart(AddToCartDto addToCartDto, Book book, User user) {
        log.info("Adding to trolley - User: {}, Book: {}, Quantity: {}",
                 user.getUsername(), book.getBookName(), addToCartDto.getQuantity());

        Cart cart = Cart.builder()
                .book(book)
                .user(user)
                .quantity(addToCartDto.getQuantity())
                .build();

        cartRepository.save(cart);
        log.debug("Trolley item saved - ID: {}", cart.getId());
    }

    @Override
    public CartDto listCartItems(User user) {
        log.debug("Listing trolley items for user: {}", user.getUsername());

        List<Cart> cartList = cartRepository.findByUserOrderByCreatedDateDesc(user);
        log.trace("Found {} trolley items", cartList.size());

        List<CartItemDto> cartItems = new ArrayList<>();
        for(Cart cart : cartList) {
            CartItemDto cartItemDto = getDtoFromCart(cart);
            cartItems.add(cartItemDto);
        }

        Double totalCost = 0.0;
        for(CartItemDto cartItemDto : cartItems) {
            totalCost += cartItemDto.getBook().getPrice() * cartItemDto.getQuantity();
        }
        log.debug("Calculated total trolley cost: {}", totalCost);

        return CartDto.builder()
                .cartItems(cartItems)
                .totalCost(totalCost)
                .build();
    }

    @Override
    public void updateCartItem(Long quantity, User user, Long itemId) {
        log.info("Updating trolley item - ID: {}, New Quantity: {}, User: {}",
                 itemId, quantity, user.getUsername());

        Cart cart = cartRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found."));

        if(!cart.getUser().getId().equals(user.getId())) {
            log.warn("Unauthorised trolley update attempt by user: {}", user.getUsername());
            throw new RuntimeException("Unauthorized to update this cart item.");
        }

        if(quantity > cart.getBook().getQuantity()) {
            log.warn("Quantity exceeds available stock - Book: {}, Available: {}, Requested: {}",
                     cart.getBook().getBookName(), cart.getBook().getQuantity(), quantity);
            throw new RuntimeException("Book quantity exceeds the amount available in the database");
        }

        cart.setQuantity(quantity);
        cart.setCreatedDate(new Date());
        cartRepository.save(cart);
        log.debug("Trolley item updated successfully");
    }

    @Override
    public void deleteCartItem(Long itemId, User user) {
        log.info("Deleting trolley item - ID: {}, User: {}", itemId, user.getUsername());

        Cart cart = cartRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if(!cart.getUser().getId().equals(user.getId())) {
            log.warn("Unauthorised trolley deletion attempt by user: {}", user.getUsername());
            throw new RuntimeException("Unauthorised to delete this cart item.");
        }

        cartRepository.delete(cart);
        log.debug("Cart item deleted successfully");
    }

    @Override
    public CartItemDto getDtoFromCart(Cart cart) {
        log.trace("Converting trolley to DTO - Cart ID: {}", cart.getId());
        return CartItemDto.builder()
                .book(cart.getBook())
                .quantity(cart.getQuantity())
                .id(cart.getId())
                .build();
    }

    @Override
    public void deleteUserCartItems(User user) {
        log.info("Clearing all trolley items for user: {}", user.getUsername());
        cartRepository.deleteByUser(user);
        log.debug("All trolley items deleted for user");
    }
}