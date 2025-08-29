package com.paymate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "expenses")
public class Expense {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String title;
    
    private String description;
    
    @NotNull
    @DecimalMin(value = "0.01")
    @Column(precision = 19, scale = 2)
    private BigDecimal totalAmount;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paid_by_user_id", nullable = false)
    private User paidBy;
    
    @Enumerated(EnumType.STRING)
    private SplitType splitType = SplitType.EQUAL;
    
    @Enumerated(EnumType.STRING)
    private ExpenseStatus status = ExpenseStatus.PENDING;
    
    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ExpenseParticipant> participants = new HashSet<>();
    
    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Transaction> transactions = new HashSet<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private ExpenseGroup group;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Constructors
    public Expense() {}
    
    public Expense(String title, String description, BigDecimal totalAmount, User paidBy, SplitType splitType) {
        this.title = title;
        this.description = description;
        this.totalAmount = totalAmount;
        this.paidBy = paidBy;
        this.splitType = splitType;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public User getPaidBy() { return paidBy; }
    public void setPaidBy(User paidBy) { this.paidBy = paidBy; }
    
    public SplitType getSplitType() { return splitType; }
    public void setSplitType(SplitType splitType) { this.splitType = splitType; }
    
    public ExpenseStatus getStatus() { return status; }
    public void setStatus(ExpenseStatus status) { this.status = status; }
    
    public Set<ExpenseParticipant> getParticipants() { return participants; }
    public void setParticipants(Set<ExpenseParticipant> participants) { this.participants = participants; }
    
    public Set<Transaction> getTransactions() { return transactions; }
    public void setTransactions(Set<Transaction> transactions) { this.transactions = transactions; }
    
    public ExpenseGroup getGroup() { return group; }
    public void setGroup(ExpenseGroup group) { this.group = group; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

