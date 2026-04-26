package com.fooddelivery.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

public final class OrderDtos {

    private OrderDtos() {}

    public record PlaceOrderRequest(
            @NotBlank String deliveryAddress,
            @NotBlank String paymentMethod
    ) {}

    public record UpdateOrderStatusRequest(@NotBlank String status) {}

    public record OrderItemResponse(
            Long id,
            Long menuItemId,
            String name,
            Integer quantity,
            Double price
    ) {}

    public record OrderResponse(
            Long id,
            String trackingCode,
            String status,
            String paymentStatus,
            String restaurantName,
            String deliveryAddress,
            String paymentMethod,
            Double subtotal,
            Double deliveryFee,
            Double totalAmount,
            LocalDateTime createdAt,
            LocalDateTime estimatedDeliveryAt,
            List<OrderItemResponse> items
    ) {}
}