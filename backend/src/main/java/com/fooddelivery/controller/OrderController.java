package com.fooddelivery.controller;

import com.fooddelivery.dto.OrderDtos;
import com.fooddelivery.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/place")
    public OrderDtos.OrderResponse placeOrder(Authentication authentication,
                                              @Valid @RequestBody OrderDtos.PlaceOrderRequest request) {
        return orderService.placeOrder(authentication.getName(), request);
    }

    @GetMapping("/my")
    public List<OrderDtos.OrderResponse> myOrders(Authentication authentication) {
        return orderService.myOrders(authentication.getName());
    }
}
