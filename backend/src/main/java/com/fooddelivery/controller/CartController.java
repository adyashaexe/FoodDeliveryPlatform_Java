package com.fooddelivery.controller;

import com.fooddelivery.dto.CartDtos;
import com.fooddelivery.service.CartService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public CartDtos.CartResponse getCart(Authentication authentication) {
        return cartService.getCart(authentication.getName());
    }

    @PostMapping("/add")
    public CartDtos.CartResponse addToCart(Authentication authentication,
                                          @Valid @RequestBody CartDtos.AddCartItemRequest request) {
        return cartService.addItem(authentication.getName(), request);
    }

    @PutMapping("/items/{cartItemId}")
    public CartDtos.CartResponse updateCartItem(Authentication authentication, @PathVariable Long cartItemId,
                                                @Valid @RequestBody CartDtos.UpdateCartItemRequest request) {
        return cartService.updateItem(authentication.getName(), cartItemId, request);
    }

    @DeleteMapping("/items/{cartItemId}")
    public CartDtos.CartResponse removeCartItem(Authentication authentication, @PathVariable Long cartItemId) {
        return cartService.removeItem(authentication.getName(), cartItemId);
    }

    @DeleteMapping
    public CartDtos.CartResponse clearCart(Authentication authentication) {
        return cartService.clearCart(authentication.getName());
    }
}
