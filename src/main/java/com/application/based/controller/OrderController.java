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
import com.application.based.util.PDFGenerator;
import com.lowagie.text.DocumentException;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
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

    @Autowired
    private PDFGenerator pdfGenerator;

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

    @GetMapping("/export-to-pdf/{orderId}")
    public void generatePdfFile(HttpServletResponse response, @PathVariable Long orderId)
            throws DocumentException, IOException {

        response.setContentType("application/pdf");
        String currentDateTime = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date());
        response.setHeader("Content-Disposition", "attachment; filename=order_" + currentDateTime + ".pdf");

        Order order = orderService.findOrderById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        pdfGenerator.generate(order, response);
    }
}
