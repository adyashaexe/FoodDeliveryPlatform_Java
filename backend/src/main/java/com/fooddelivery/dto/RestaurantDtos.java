package com.fooddelivery.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

public final class RestaurantDtos {

    private RestaurantDtos() {
    }

    public record RestaurantSummaryResponse(
            Long id,
            String name,
            String cuisine,
            String city,
            String address,
            String description,
            String imageUrl,
            Double rating,
            Integer deliveryTimeMinutes,
            Double deliveryFee,
            Integer minOrderAmount,
            boolean open
    ) {
    }

    public record MenuItemResponse(
            Long id,
            Long restaurantId,
            String name,
            String description,
            Double price,
            String category,
            String imageUrl,
            boolean veg,
            boolean available,
            boolean bestseller
    ) {
    }

    public record RestaurantDetailsResponse(
            RestaurantSummaryResponse restaurant,
            List<MenuItemResponse> menu
    ) {
    }

    public record RestaurantRequest(
            @NotBlank String name,
            @NotBlank String cuisine,
            @NotBlank String city,
            String address,
            String description,
            String imageUrl,
            @NotNull Double rating,
            @NotNull Integer deliveryTimeMinutes,
            @NotNull Double deliveryFee,
            @NotNull Integer minOrderAmount,
            boolean open
    ) {
    }

    public record MenuItemRequest(
            @NotBlank String name,
            String description,
            @NotNull @Positive Double price,
            @NotBlank String category,
            String imageUrl,
            boolean veg,
            boolean available,
            boolean bestseller
    ) {
    }
}
