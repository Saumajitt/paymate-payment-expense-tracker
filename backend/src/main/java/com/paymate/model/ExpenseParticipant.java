package com.paymate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "expense_participants")
public class ExpenseParticipant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotNull
    @DecimalMin(value = "0.00")
    @Column(precision = 19, scale = 2)
    private BigDecimal owedAmount;
    
    @Column(precision = 19, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;
    
    private BigDecimal percentage; // For percentage-based splits
    
    private Integer shares; // For share-based splits
    
    @Enumerated(EnumType.STRING)
    private ParticipantStatus status = ParticipantStatus.PENDING;
    
    // Constructors
    public ExpenseParticipant() {}
    
    public ExpenseParticipant(Expense expense, User user, BigDecimal owedAmount) {
        this.expense = expense;
        this.user = user;
        this.owedAmount = owedAmount;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Expense getExpense() { return expense; }
    public void setExpense(Expense expense) { this.expense = expense; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public BigDecimal getOwedAmount() { return owedAmount; }
    public void setOwedAmount(BigDecimal owedAmount) { this.owedAmount = owedAmount; }
    
    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
    
    public BigDecimal getPercentage() { return percentage; }
    public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }
    
    public Integer getShares() { return shares; }
    public void setShares(Integer shares) { this.shares = shares; }
    
    public ParticipantStatus getStatus() { return status; }
    public void setStatus(ParticipantStatus status) { this.status = status; }
    
    public BigDecimal getRemainingAmount() {
        return owedAmount.subtract(paidAmount);
    }
}

