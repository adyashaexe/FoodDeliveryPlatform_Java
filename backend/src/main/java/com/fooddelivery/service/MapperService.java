package com.fooddelivery.service;

import com.fooddelivery.dto.AuthDtos;
import com.fooddelivery.dto.CartDtos;
import com.fooddelivery.dto.OrderDtos;
import com.fooddelivery.dto.RestaurantDtos;
import com.fooddelivery.model.CartItem;
import com.fooddelivery.model.MenuItem;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.OrderItem;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.model.User;
import com.fooddelivery.repository.OrderItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MapperService {

    private final OrderItemRepository orderItemRepository;

    public MapperService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    public AuthDtos.UserResponse toUserResponse(User user) {
        return new AuthDtos.UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name()
        );
    }

    public RestaurantDtos.RestaurantSummaryResponse toRestaurantSummary(Restaurant restaurant) {
        return new RestaurantDtos.RestaurantSummaryResponse(
                restaurant.getId(),
                restaurant.getName(),
                restaurant.getCuisine(),
                restaurant.getCity(),
                restaurant.getAddress(),
                restaurant.getDescription(),
                restaurant.getImageUrl(),
                restaurant.getRating(),
                restaurant.getDeliveryTimeMinutes(),
                restaurant.getDeliveryFee(),
                restaurant.getMinOrderAmount(),
                restaurant.isOpen()
        );
    }

    public RestaurantDtos.MenuItemResponse toMenuItemResponse(MenuItem menuItem) {
        return new RestaurantDtos.MenuItemResponse(
                menuItem.getId(),
                menuItem.getRestaurant().getId(),
                menuItem.getName(),
                menuItem.getDescription(),
                menuItem.getPrice(),
                menuItem.getCategory(),
                menuItem.getImageUrl(),
                menuItem.isVeg(),
                menuItem.isAvailable(),
                menuItem.isBestseller()
        );
    }

    public CartDtos.CartItemResponse toCartItemResponse(CartItem cartItem) {
        return new CartDtos.CartItemResponse(
                cartItem.getId(),
                cartItem.getMenuItem().getId(),
                cartItem.getMenuItem().getName(),
                cartItem.getMenuItem().getCategory(),
                cartItem.getPrice(),
                cartItem.getQuantity(),
                cartItem.getPrice() * cartItem.getQuantity()
        );
    }

    public OrderDtos.OrderResponse toOrderResponse(Order order) {
        List<OrderDtos.OrderItemResponse> items = orderItemRepository.findByOrderId(order.getId()).stream()
                .map(this::toOrderItemResponse)
                .toList();

        return new OrderDtos.OrderResponse(
                order.getId(),
                order.getTrackingCode(),
                order.getStatus().name(),
                order.getPaymentStatus().name(),
                order.getRestaurant().getName(),
                order.getDeliveryAddress(),
                order.getPaymentMethod(),
                order.getSubtotal(),
                order.getDeliveryFee(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                order.getEstimatedDeliveryAt(),
                items
        );
    }

    private OrderDtos.OrderItemResponse toOrderItemResponse(OrderItem item) {
        return new OrderDtos.OrderItemResponse(
                item.getId(),
                item.getMenuItem().getId(),
                item.getMenuItem().getName(),
                item.getQuantity(),
                item.getPrice()
        );
    }
}
