package com.application.based.controller;

import com.application.based.entity.Order;
import com.application.based.entity.User;
import com.application.based.model.cart.CartDto;
import com.application.based.model.cart.CartItemDto;
import com.application.based.model.checkout.CheckoutItemDto;
import com.application.based.model.checkout.StripeResponse;
import com.application.based.service.CartService;
import com.application.based.service.OrderService;
import com.application.based.util.AuthenticatedUserUtil;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthenticatedUserUtil authenticatedUserUtil;

    @Autowired
    private CartService cartService;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<StripeResponse> checkoutList(HttpServletRequest request) throws StripeException{
        User user = authenticatedUserUtil.getCurrentAuthenticatedUser(request);
        CartDto cartDto = cartService.listCartItems(user);

        List<CheckoutItemDto> checkoutItemDtoList = new ArrayList<>();

        for(CartItemDto cartItemDto : cartDto.getCartItems()){
            CheckoutItemDto checkoutItemDto = CheckoutItemDto.builder()
                    .userId(user.getId())
                    .bookName(cartItemDto.getBook().getBookName())
                    .bookId(cartItemDto.getBook().getId())
                    .quantity(cartItemDto.getQuantity())
                    .price(cartItemDto.getBook().getPrice())
                    .build();

            checkoutItemDtoList.add(checkoutItemDto);
        }

        Session session = orderService.createSession(checkoutItemDtoList);
        StripeResponse stripeResponse = StripeResponse.builder()
                .sessionId(session.getId())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(stripeResponse);
    }

    @PostMapping("/add")
    public ResponseEntity<String> placeOrder(HttpServletRequest request, @RequestParam("sessionId") String sessionId){
        User user = authenticatedUserUtil.getCurrentAuthenticatedUser(request);
        orderService.placeOrder(user, sessionId);
        return ResponseEntity.status(HttpStatus.CREATED).body("Order has been placed");
    }

    @GetMapping("/")
    public ResponseEntity<List<Order>> getAllOrders(HttpServletRequest request){
            User user = authenticatedUserUtil.getCurrentAuthenticatedUser(request);
            List<Order> orderDtoList = orderService.listOrders(user);
            return ResponseEntity.status(HttpStatus.OK).body(orderDtoList);
    }
}
