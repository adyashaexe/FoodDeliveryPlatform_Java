package com.fooddelivery.service;

import com.fooddelivery.dto.RestaurantDtos;
import com.fooddelivery.model.MenuItem;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final MapperService mapperService;

    public RestaurantService(RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository,
                             MapperService mapperService) {
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.mapperService = mapperService;
    }

    public List<RestaurantDtos.RestaurantSummaryResponse> listRestaurants(String query) {
        List<Restaurant> restaurants = (query == null || query.isBlank())
                ? restaurantRepository.findByOpenTrue()
                : restaurantRepository.findByCuisineContainingIgnoreCaseOrNameContainingIgnoreCase(query, query);
        return restaurants.stream().map(mapperService::toRestaurantSummary).toList();
    }

    public RestaurantDtos.RestaurantDetailsResponse getRestaurantDetails(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Restaurant not found"));
        List<RestaurantDtos.MenuItemResponse> menu = menuItemRepository
                .findByRestaurantIdAndAvailableTrueOrderByCategoryAscNameAsc(id)
                .stream()
                .map(mapperService::toMenuItemResponse)
                .toList();
        return new RestaurantDtos.RestaurantDetailsResponse(mapperService.toRestaurantSummary(restaurant), menu);
    }

    public List<RestaurantDtos.MenuItemResponse> getMenu(Long restaurantId) {
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResponseStatusException(NOT_FOUND, "Restaurant not found");
        }
        return menuItemRepository.findByRestaurantIdAndAvailableTrueOrderByCategoryAscNameAsc(restaurantId)
                .stream()
                .map(mapperService::toMenuItemResponse)
                .toList();
    }

    public RestaurantDtos.RestaurantSummaryResponse createRestaurant(RestaurantDtos.RestaurantRequest request) {
        Restaurant restaurant = new Restaurant();
        applyRestaurantRequest(restaurant, request);
        return mapperService.toRestaurantSummary(restaurantRepository.save(restaurant));
    }

    public RestaurantDtos.RestaurantSummaryResponse updateRestaurant(Long id, RestaurantDtos.RestaurantRequest request) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Restaurant not found"));
        applyRestaurantRequest(restaurant, request);
        return mapperService.toRestaurantSummary(restaurantRepository.save(restaurant));
    }

    public RestaurantDtos.MenuItemResponse addMenuItem(Long restaurantId, RestaurantDtos.MenuItemRequest request) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Restaurant not found"));
        MenuItem menuItem = new MenuItem();
        menuItem.setRestaurant(restaurant);
        applyMenuItemRequest(menuItem, request);
        return mapperService.toMenuItemResponse(menuItemRepository.save(menuItem));
    }

    public RestaurantDtos.MenuItemResponse updateMenuItem(Long menuItemId, RestaurantDtos.MenuItemRequest request) {
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Menu item not found"));
        applyMenuItemRequest(menuItem, request);
        return mapperService.toMenuItemResponse(menuItemRepository.save(menuItem));
    }

    public void deleteMenuItem(Long menuItemId) {
        if (!menuItemRepository.existsById(menuItemId)) {
            throw new ResponseStatusException(NOT_FOUND, "Menu item not found");
        }
        menuItemRepository.deleteById(menuItemId);
    }

    private void applyRestaurantRequest(Restaurant restaurant, RestaurantDtos.RestaurantRequest request) {
        restaurant.setName(request.name());
        restaurant.setCuisine(request.cuisine());
        restaurant.setCity(request.city());
        restaurant.setAddress(request.address());
        restaurant.setDescription(request.description());
        restaurant.setImageUrl(request.imageUrl());
        restaurant.setRating(request.rating());
        restaurant.setDeliveryTimeMinutes(request.deliveryTimeMinutes());
        restaurant.setDeliveryFee(request.deliveryFee());
        restaurant.setMinOrderAmount(request.minOrderAmount());
        restaurant.setOpen(request.open());
    }

    private void applyMenuItemRequest(MenuItem menuItem, RestaurantDtos.MenuItemRequest request) {
        menuItem.setName(request.name());
        menuItem.setDescription(request.description());
        menuItem.setPrice(request.price());
        menuItem.setCategory(request.category());
        menuItem.setImageUrl(request.imageUrl());
        menuItem.setVeg(request.veg());
        menuItem.setAvailable(request.available());
        menuItem.setBestseller(request.bestseller());
    }
}
