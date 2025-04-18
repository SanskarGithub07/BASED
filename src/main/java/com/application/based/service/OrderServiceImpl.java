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
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
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

    private SessionCreateParams.LineItem.PriceData createPriceData(CheckoutItemDto checkoutItemDto) {
        log.trace("Creating price data for book: {}", checkoutItemDto.getBookName());
        return SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency("usd")
                .setUnitAmount((long)(checkoutItemDto.getPrice()*100))
                .setProductData(
                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                .setName(checkoutItemDto.getBookName())
                                .build())
                .build();
    }

    private SessionCreateParams.LineItem createSessionLineItem(CheckoutItemDto checkoutItemDto) {
        log.trace("Creating session line item for {} (Qty: {})",
                  checkoutItemDto.getBookName(), checkoutItemDto.getQuantity());
        return SessionCreateParams.LineItem.builder()
                .setPriceData(createPriceData(checkoutItemDto))
                .setQuantity(Long.parseLong(String.valueOf(checkoutItemDto.getQuantity())))
                .build();
    }

    @Override
    public Session createSession(List<CheckoutItemDto> checkoutItemDtoList) throws StripeException {
        log.info("Creating Stripe checkout session for {} items", checkoutItemDtoList.size());
        String successUrl = baseUrl + "payment/success";
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

        Session session = Session.create(params);
        log.debug("Stripe session created - ID: {}", session.getId());
        return session;
    }

    @Override
    @Transactional
    public void placeOrder(User user, String sessionId) {
        log.info("Placing order for user: {} (Session: {})", user.getUsername(), sessionId);

        if (orderRepository.existsBySessionId(sessionId)) {
            log.warn("Duplicate order attempt - Session ID already exists: {}", sessionId);
            return;
        }

        CartDto cartDto = cartService.listCartItems(user);
        List<CartItemDto> cartItemDtoList = cartDto.getCartItems();
        log.debug("Processing {} cart items for order", cartItemDtoList.size());

        Order order = Order.builder()
                .createdDate(new Date())
                .totalPrice(cartDto.getTotalCost())
                .sessionId(sessionId)
                .user(user)
                .build();

        Order savedOrder = orderRepository.save(order);
        log.info("Order created - ID: {}, Total: ${}",
                 savedOrder.getId(), savedOrder.getTotalPrice());

        for (CartItemDto cartItemDto : cartItemDtoList) {
            OrderItem orderItem = OrderItem.builder()
                    .createdDate(new Date())
                    .price(cartItemDto.getBook().getPrice())
                    .book(cartItemDto.getBook())
                    .quantity(cartItemDto.getQuantity())
                    .order(order)
                    .build();

            orderItemsRepository.save(orderItem);
            log.trace("Order item added - Book: {}, Qty: {}",
                      cartItemDto.getBook().getBookName(), cartItemDto.getQuantity());
        }

        cartService.deleteUserCartItems(user);
        log.debug("Cleared cart after order placement");
    }

    @Override
    public List<Order> listOrders(User user) {
        log.debug("Fetching order history for user: {}", user.getUsername());
        List<Order> orders = orderRepository.findAllByUserOrderByCreatedDateDesc(user);
        log.trace("Found {} orders for user {}", orders.size(), user.getUsername());
        return orders;
    }
}