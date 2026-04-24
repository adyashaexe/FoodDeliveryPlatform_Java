package com.fooddelivery.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public final class CartDtos {

    private CartDtos() {
    }

    public record AddCartItemRequest(
            @NotNull Long menuItemId,
            @NotNull @Min(1) Integer quantity
    ) {
    }

    public record UpdateCartItemRequest(@NotNull @Min(1) Integer quantity) {
    }

    public record CartItemResponse(
            Long id,
            Long menuItemId,
            String name,
            String category,
            Double unitPrice,
            Integer quantity,
            Double lineTotal
    ) {
    }

    public record CartResponse(
            Long id,
            Long restaurantId,
            String restaurantName,
            List<CartItemResponse> items,
            Double subtotal,
            Double deliveryFee,
            Double total
    ) {
    }
}
