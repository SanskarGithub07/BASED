package com.application.based.service;

import com.application.based.entity.Order;
import com.application.based.entity.OrderItem;
import com.application.based.entity.User;
import com.application.based.model.cart.CartDto;
import com.application.based.model.cart.CartItemDto;
import com.application.based.model.checkout.CheckoutItemDto;
import com.application.based.repository.OrderItemsRepository;
import com.application.based.repository.OrderRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderItemsRepository orderItemsRepository;

    @Value("${app.stripe.secret-key}")
    private String apiKey;
    @Value("${app.base-url}")
    private String baseUrl;

    SessionCreateParams.LineItem.PriceData createPriceData(CheckoutItemDto checkoutItemDto){
        return SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency("usd")
                .setUnitAmount((long)(checkoutItemDto.getPrice()*100))
                .setProductData(
                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                .setName(checkoutItemDto.getBookName())
                                .build())
                .build();
    }

    SessionCreateParams.LineItem createSessionLineItem(CheckoutItemDto checkoutItemDto){
        return SessionCreateParams.LineItem.builder()
                .setPriceData(createPriceData(checkoutItemDto))
                .setQuantity(Long.parseLong(String.valueOf(checkoutItemDto.getQuantity())))
                .build();
    }
    @Override
    public Session createSession(List<CheckoutItemDto> checkoutItemDtoList) throws StripeException {
        String successUrl = baseUrl + "payment/success?session_id={CHECKOUT_SESSION_ID}";
        String failedUrl = baseUrl + "payment/failed";

        Stripe.apiKey = apiKey;
        List<SessionCreateParams.LineItem> sessionItemsList = new ArrayList<>();

        for(CheckoutItemDto checkoutItemDto : checkoutItemDtoList) {
            sessionItemsList.add(createSessionLineItem(checkoutItemDto));
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setCancelUrl(failedUrl)
                .addAllLineItem(sessionItemsList)
                .setSuccessUrl(successUrl)
                .build();

        return Session.create(params);
    }

    @Override
    @Transactional
    public void placeOrder(User user, String sessionId) {
        if (orderRepository.existsBySessionId(sessionId)) {
            // Order already exists; don't create again
            return;
        }

        CartDto cartDto = cartService.listCartItems(user);
        List<CartItemDto> cartItemDtoList = cartDto.getCartItems();

        Order order = Order.builder()
                .createdDate(new Date())
                .totalPrice(cartDto.getTotalCost())
                .sessionId(sessionId)
                .user(user)
                .build();

        orderRepository.save(order);

        for (CartItemDto cartItemDto : cartItemDtoList) {
            OrderItem orderItem = OrderItem.builder()
                    .createdDate(new Date())
                    .price(cartItemDto.getBook().getPrice())
                    .book(cartItemDto.getBook())
                    .quantity(cartItemDto.getQuantity())
                    .order(order)
                    .build();

            orderItemsRepository.save(orderItem);
        }

        cartService.deleteUserCartItems(user);
    }

    @Override
    public List<Order> listOrders(User user) {
        return orderRepository.findAllByUserOrderByCreatedDateDesc(user);
    }
}
