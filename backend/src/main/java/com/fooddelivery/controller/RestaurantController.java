package com.fooddelivery.controller;

import com.fooddelivery.dto.RestaurantDtos;
import com.fooddelivery.service.RestaurantService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    public List<RestaurantDtos.RestaurantSummaryResponse> restaurants(
            @RequestParam(required = false) String q) {
        return restaurantService.listRestaurants(q);
    }

    @GetMapping("/{restaurantId}")
    public RestaurantDtos.RestaurantDetailsResponse restaurant(@PathVariable Long restaurantId) {
        return restaurantService.getRestaurantDetails(restaurantId);
    }

    @GetMapping("/{restaurantId}/menu")
    public List<RestaurantDtos.MenuItemResponse> menu(@PathVariable Long restaurantId) {
        return restaurantService.getMenu(restaurantId);
    }
}
