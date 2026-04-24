package com.fooddelivery.service;

import com.fooddelivery.dto.CartDtos;
import com.fooddelivery.model.Cart;
import com.fooddelivery.model.CartItem;
import com.fooddelivery.model.MenuItem;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.model.User;
import com.fooddelivery.repository.CartItemRepository;
import com.fooddelivery.repository.CartRepository;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final MapperService mapperService;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
                       MenuItemRepository menuItemRepository, UserRepository userRepository,
                       MapperService mapperService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
        this.mapperService = mapperService;
    }

    @Transactional
    public CartDtos.CartResponse getCart(String email) {
        Cart cart = getOrCreateCartByEmail(email);
        return buildCartResponse(cart);
    }

    @Transactional
    public CartDtos.CartResponse addItem(String email, CartDtos.AddCartItemRequest request) {
        Cart cart = getOrCreateCartByEmail(email);
        MenuItem menuItem = menuItemRepository.findById(request.menuItemId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Menu item not found"));

        if (!menuItem.isAvailable()) {
            throw new ResponseStatusException(BAD_REQUEST, "Menu item is not available");
        }

        Restaurant restaurant = menuItem.getRestaurant();
        if (cart.getRestaurant() != null && !cart.getRestaurant().getId().equals(restaurant.getId())) {
            throw new ResponseStatusException(BAD_REQUEST, "Cart already contains items from another restaurant");
        }

        cart.setRestaurant(restaurant);
        cartRepository.save(cart);

        CartItem item = cartItemRepository.findByCartIdAndMenuItemId(cart.getId(), menuItem.getId())
                .orElseGet(() -> {
                    CartItem cartItem = new CartItem();
                    cartItem.setCart(cart);
                    cartItem.setMenuItem(menuItem);
                    cartItem.setQuantity(0);
                    cartItem.setPrice(menuItem.getPrice());
                    return cartItem;
                });

        item.setQuantity(item.getQuantity() + request.quantity());
        item.setPrice(menuItem.getPrice());
        cartItemRepository.save(item);
        return buildCartResponse(cart);
    }

    @Transactional
    public CartDtos.CartResponse updateItem(String email, Long cartItemId, CartDtos.UpdateCartItemRequest request) {
        Cart cart = getOrCreateCartByEmail(email);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Cart item not found"));
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResponseStatusException(BAD_REQUEST, "Cart item does not belong to current user");
        }
        item.setQuantity(request.quantity());
        cartItemRepository.save(item);
        return buildCartResponse(cart);
    }

    @Transactional
    public CartDtos.CartResponse removeItem(String email, Long cartItemId) {
        Cart cart = getOrCreateCartByEmail(email);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Cart item not found"));
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResponseStatusException(BAD_REQUEST, "Cart item does not belong to current user");
        }
        cartItemRepository.delete(item);
        cleanupRestaurantIfEmpty(cart);
        return buildCartResponse(cart);
    }

    @Transactional
    public CartDtos.CartResponse clearCart(String email) {
        Cart cart = getOrCreateCartByEmail(email);
        cartItemRepository.deleteByCartId(cart.getId());
        cart.setRestaurant(null);
        cartRepository.save(cart);
        return buildCartResponse(cart);
    }

    @Transactional
    public Cart getOrCreateCartByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        return cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    private CartDtos.CartResponse buildCartResponse(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        double subtotal = items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        double deliveryFee = cart.getRestaurant() != null ? cart.getRestaurant().getDeliveryFee() : 0.0;
        double total = items.isEmpty() ? 0.0 : subtotal + deliveryFee;
        return new CartDtos.CartResponse(
                cart.getId(),
                cart.getRestaurant() != null ? cart.getRestaurant().getId() : null,
                cart.getRestaurant() != null ? cart.getRestaurant().getName() : null,
                items.stream().map(mapperService::toCartItemResponse).toList(),
                subtotal,
                deliveryFee,
                total
        );
    }

    private void cleanupRestaurantIfEmpty(Cart cart) {
        if (cartItemRepository.findByCartId(cart.getId()).isEmpty()) {
            cart.setRestaurant(null);
            cartRepository.save(cart);
        }
    }
}
