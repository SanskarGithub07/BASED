package com.application.based.service;

import com.application.based.entity.Order;
import com.application.based.entity.User;
import com.application.based.model.checkout.CheckoutItemDto;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;

import java.util.List;

public interface OrderService {
    Session createSession(List<CheckoutItemDto> checkoutItemDtoList) throws StripeException;

    void placeOrder(User user, String sessionId);

    List<Order> listOrders(User user);
}
