package com.fooddelivery.service;

import com.fooddelivery.dto.OrderDtos;
import com.fooddelivery.model.Cart;
import com.fooddelivery.model.CartItem;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.OrderItem;
import com.fooddelivery.model.User;
import com.fooddelivery.repository.CartItemRepository;
import com.fooddelivery.repository.OrderItemRepository;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class OrderService {

    private final CartService cartService;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final MapperService mapperService;

    public OrderService(CartService cartService, CartItemRepository cartItemRepository,
                        OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                        UserRepository userRepository,
                        MapperService mapperService) {
        this.cartService = cartService;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.mapperService = mapperService;
    }

    @Transactional
    public OrderDtos.OrderResponse placeOrder(String email, OrderDtos.PlaceOrderRequest request) {
        Cart cart = cartService.getOrCreateCartByEmail(email);
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty() || cart.getRestaurant() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Cart is empty");
        }

        double subtotal = cartItems.stream().mapToDouble(item -> item.getPrice() * item.getQuantity()).sum();
        if (subtotal < cart.getRestaurant().getMinOrderAmount()) {
            throw new ResponseStatusException(BAD_REQUEST,
                    "Minimum order amount is " + cart.getRestaurant().getMinOrderAmount());
        }

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setRestaurant(cart.getRestaurant());
        order.setDeliveryAddress(request.deliveryAddress());
        order.setPaymentMethod(request.paymentMethod());
        order.setSubtotal(subtotal);
        order.setDeliveryFee(cart.getRestaurant().getDeliveryFee());
        order.setTotalAmount(subtotal + order.getDeliveryFee());
        order.setTrackingCode("FD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setEstimatedDeliveryAt(LocalDateTime.now().plusMinutes(cart.getRestaurant().getDeliveryTimeMinutes()));
        orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(cartItem.getMenuItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItemRepository.save(orderItem);
        }

        cartItemRepository.deleteByCartId(cart.getId());
        cart.setRestaurant(null);
        cartService.clearCart(email);

        return mapperService.toOrderResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDtos.OrderResponse> myOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(mapperService::toOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderDtos.OrderResponse> allOrders() {
        return orderRepository.findAll().stream()
                .map(mapperService::toOrderResponse)
                .toList();
    }

    @Transactional
    public OrderDtos.OrderResponse updateStatus(Long orderId, OrderDtos.UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Order not found"));
        try {
            order.setStatus(Order.Status.valueOf(request.status().toUpperCase()));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid order status");
        }
        return mapperService.toOrderResponse(orderRepository.save(order));
    }
}
