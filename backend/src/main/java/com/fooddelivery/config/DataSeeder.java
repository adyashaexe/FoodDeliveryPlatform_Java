package com.fooddelivery.config;

import com.fooddelivery.model.MenuItem;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.model.User;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(UserRepository userRepository,
                               RestaurantRepository restaurantRepository,
                               MenuItemRepository menuItemRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByEmail("admin@foodly.dev")) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@foodly.dev");
                admin.setPhone("9999999999");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole(User.Role.ADMIN);
                userRepository.save(admin);
            }

            if (!userRepository.existsByEmail("user@foodly.dev")) {
                User customer = new User();
                customer.setName("Demo User");
                customer.setEmail("user@foodly.dev");
                customer.setPhone("8888888888");
                customer.setPassword(passwordEncoder.encode("User@123"));
                customer.setRole(User.Role.CUSTOMER);
                userRepository.save(customer);
            }

            if (restaurantRepository.count() == 0) {
                Restaurant spiceRoute = createRestaurant(
                        "Spice Route", "Indian", "Bhubaneswar", "KIIT Road, Patia",
                        "North Indian comfort food with quick delivery.",
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
                        4.7, 28, 30.0, 199, true);

                Restaurant wokTheory = createRestaurant(
                        "Wok Theory", "Asian", "Bhubaneswar", "Infocity Square",
                        "Noodles, rice bowls, dumplings, and bold sauces.",
                        "https://images.unsplash.com/photo-1552566626-52f8b828add9",
                        4.5, 32, 35.0, 249, true);

                Restaurant crustAndCo = createRestaurant(
                        "Crust & Co", "Pizza", "Bhubaneswar", "Nandankanan Road",
                        "Wood-fired pizzas, pasta, and cheesy sides.",
                        "https://images.unsplash.com/photo-1513104890138-7c749659a591",
                        4.6, 25, 40.0, 299, true);

                restaurantRepository.save(spiceRoute);
                restaurantRepository.save(wokTheory);
                restaurantRepository.save(crustAndCo);

                menuItemRepository.save(createMenuItem(spiceRoute, "Butter Chicken Bowl",
                        "Creamy tomato gravy with rice", 269.0, "Mains", false, true, true));
                menuItemRepository.save(createMenuItem(spiceRoute, "Paneer Tikka Wrap",
                        "Smoky paneer in soft roomali wrap", 189.0, "Wraps", true, true, false));
                menuItemRepository.save(createMenuItem(spiceRoute, "Masala Fries",
                        "Crispy fries dusted with chaat masala", 119.0, "Sides", true, true, false));

                menuItemRepository.save(createMenuItem(wokTheory, "Chilli Garlic Noodles",
                        "Street-style noodles with veggies", 209.0, "Noodles", true, true, true));
                menuItemRepository.save(createMenuItem(wokTheory, "Chicken Katsu Rice",
                        "Crunchy chicken with sticky rice", 289.0, "Bowls", false, true, false));
                menuItemRepository.save(createMenuItem(wokTheory, "Veg Dim Sum",
                        "Steamed dumplings with sesame dip", 169.0, "Starters", true, true, false));

                menuItemRepository.save(createMenuItem(crustAndCo, "Farmhouse Pizza",
                        "Loaded with vegetables and mozzarella", 349.0, "Pizza", true, true, true));
                menuItemRepository.save(createMenuItem(crustAndCo, "Pepperoni Pizza",
                        "Classic pepperoni with smoked cheese", 399.0, "Pizza", false, true, true));
                menuItemRepository.save(createMenuItem(crustAndCo, "Alfredo Pasta",
                        "Creamy garlic sauce pasta", 259.0, "Pasta", true, true, false));
            }
        };
    }

    private Restaurant createRestaurant(String name, String cuisine, String city, String address,
                                        String description, String imageUrl, Double rating,
                                        Integer deliveryTime, Double deliveryFee,
                                        Integer minOrder, boolean open) {
        Restaurant r = new Restaurant();
        r.setName(name);
        r.setCuisine(cuisine);
        r.setCity(city);
        r.setAddress(address);
        r.setDescription(description);
        r.setImageUrl(imageUrl);
        r.setRating(rating);
        r.setDeliveryTimeMinutes(deliveryTime);
        r.setDeliveryFee(deliveryFee);
        r.setMinOrderAmount(minOrder);
        r.setOpen(open);
        return r;
    }

    private MenuItem createMenuItem(Restaurant restaurant, String name, String description,
                                    Double price, String category, boolean veg,
                                    boolean available, boolean bestseller) {
        MenuItem m = new MenuItem();
        m.setRestaurant(restaurant);
        m.setName(name);
        m.setDescription(description);
        m.setPrice(price);
        m.setCategory(category);
        m.setVeg(veg);
        m.setAvailable(available);
        m.setBestseller(bestseller);
        return m;
    }
}