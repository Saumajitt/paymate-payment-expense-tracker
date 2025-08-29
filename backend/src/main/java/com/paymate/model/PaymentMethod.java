package com.paymate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_methods")
public class PaymentMethod {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    private PaymentType type;
    
    @NotBlank
    private String token; // Encrypted token from payment provider
    
    private String last4; // Last 4 digits for display
    
    private String brand; // Visa, MasterCard, etc.
    
    private String expiryMonth;
    
    private String expiryYear;
    
    private boolean isDefault = false;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    // Constructors
    public PaymentMethod() {}
    
    public PaymentMethod(User user, PaymentType type, String token, String last4, String brand) {
        this.user = user;
        this.type = type;
        this.token = token;
        this.last4 = last4;
        this.brand = brand;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public PaymentType getType() { return type; }
    public void setType(PaymentType type) { this.type = type; }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getLast4() { return last4; }
    public void setLast4(String last4) { this.last4 = last4; }
    
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    
    public String getExpiryMonth() { return expiryMonth; }
    public void setExpiryMonth(String expiryMonth) { this.expiryMonth = expiryMonth; }
    
    public String getExpiryYear() { return expiryYear; }
    public void setExpiryYear(String expiryYear) { this.expiryYear = expiryYear; }
    
    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean isDefault) { this.isDefault = isDefault; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

