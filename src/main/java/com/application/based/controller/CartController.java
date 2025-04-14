package com.application.based.controller;

import com.application.based.entity.Book;
import com.application.based.entity.User;
import com.application.based.model.cart.AddToCartDto;
import com.application.based.model.cart.CartDto;
import com.application.based.service.BookService;
import com.application.based.service.CartService;
import com.application.based.util.AuthenticatedUserUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private BookService bookService;

    @Autowired
    private CartService cartService;

    @Autowired
    private AuthenticatedUserUtil authenticatedUserUtil;

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestBody AddToCartDto addToCartDto, HttpServletRequest request){
        User user = authenticatedUserUtil.getCurrentAuthenticatedUser(request);
        System.out.println(user.toString());

        Book book = bookService.getBookByIsbn(addToCartDto.getBookIsbn());
        if(book.getQuantity() < addToCartDto.getQuantity()){
            ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Input quantity exceeds number of books available.");
        }
        System.out.println("Book to add: " + book.getBookName());
        cartService.addToCart(addToCartDto, book, user);
        return ResponseEntity.status(HttpStatus.OK).body("Added book to cart.");
    }

    @GetMapping("/")
    public ResponseEntity<CartDto> getCartItems(HttpServletRequest request){
        User user = authenticatedUserUtil.getCurrentAuthenticatedUser(request);
        CartDto cartDto = cartService.listCartItems(user);

        return ResponseEntity.status(HttpStatus.FOUND).body(cartDto);
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<String> updateCartItem(@PathVariable("cartItemId")Long itemId, @RequestBody Long quantity, HttpServletRequest request){
        User user = authenticatedUserUtil.getCurrentAuthenticatedUser(request);
        cartService.updateCartItem(quantity, user, itemId);
        return ResponseEntity.status(HttpStatus.OK).body("Cart Item successfully updated.");
    }
}
