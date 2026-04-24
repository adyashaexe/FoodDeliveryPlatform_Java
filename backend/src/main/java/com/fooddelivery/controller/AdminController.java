package com.fooddelivery.controller;

import com.fooddelivery.dto.OrderDtos;
import com.fooddelivery.dto.RestaurantDtos;
import com.fooddelivery.service.OrderService;
import com.fooddelivery.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final RestaurantService restaurantService;
    private final OrderService orderService;

    public AdminController(RestaurantService restaurantService, OrderService orderService) {
        this.restaurantService = restaurantService;
        this.orderService = orderService;
    }

    @PostMapping("/restaurants")
    public RestaurantDtos.RestaurantSummaryResponse createRestaurant(
            @Valid @RequestBody RestaurantDtos.RestaurantRequest request) {
        return restaurantService.createRestaurant(request);
    }

    @PutMapping("/restaurants/{restaurantId}")
    public RestaurantDtos.RestaurantSummaryResponse updateRestaurant(
            @PathVariable Long restaurantId,
            @Valid @RequestBody RestaurantDtos.RestaurantRequest request) {
        return restaurantService.updateRestaurant(restaurantId, request);
    }

    @PostMapping("/restaurants/{restaurantId}/menu")
    public RestaurantDtos.MenuItemResponse addMenuItem(@PathVariable Long restaurantId,
                                                       @Valid @RequestBody RestaurantDtos.MenuItemRequest request) {
        return restaurantService.addMenuItem(restaurantId, request);
    }

    @PutMapping("/menu/{menuItemId}")
    public RestaurantDtos.MenuItemResponse updateMenuItem(@PathVariable Long menuItemId,
                                                          @Valid @RequestBody RestaurantDtos.MenuItemRequest request) {
        return restaurantService.updateMenuItem(menuItemId, request);
    }

    @DeleteMapping("/menu/{menuItemId}")
    public void deleteMenuItem(@PathVariable Long menuItemId) {
        restaurantService.deleteMenuItem(menuItemId);
    }

    @GetMapping("/orders")
    public List<OrderDtos.OrderResponse> allOrders() {
        return orderService.allOrders();
    }

    @PutMapping("/orders/{orderId}/status")
    public OrderDtos.OrderResponse updateStatus(@PathVariable Long orderId,
                                                @Valid @RequestBody OrderDtos.UpdateOrderStatusRequest request) {
        return orderService.updateStatus(orderId, request);
    }
}
