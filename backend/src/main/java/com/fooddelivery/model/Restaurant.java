package com.fooddelivery.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "restaurants")
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String cuisine;

    @Column(nullable = false)
    private String city;

    private String address;

    @Column(length = 1200)
    private String description;

    private String imageUrl;

    @Column(nullable = false)
    private Double rating = 4.5;

    @Column(nullable = false)
    private Integer deliveryTimeMinutes = 30;

    @Column(nullable = false)
    private Double deliveryFee = 35.0;

    @Column(nullable = false)
    private Integer minOrderAmount = 199;

    @Column(nullable = false)
    private boolean open = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCuisine() { return cuisine; }
    public void setCuisine(String cuisine) { this.cuisine = cuisine; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getDeliveryTimeMinutes() { return deliveryTimeMinutes; }
    public void setDeliveryTimeMinutes(Integer deliveryTimeMinutes) { this.deliveryTimeMinutes = deliveryTimeMinutes; }
    public Double getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(Double deliveryFee) { this.deliveryFee = deliveryFee; }
    public Integer getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(Integer minOrderAmount) { this.minOrderAmount = minOrderAmount; }
    public boolean isOpen() { return open; }
    public void setOpen(boolean open) { this.open = open; }
}