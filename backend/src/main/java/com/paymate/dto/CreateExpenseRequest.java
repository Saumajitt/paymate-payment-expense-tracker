package com.paymate.dto;

import com.paymate.model.SplitType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class CreateExpenseRequest {
    
    @NotBlank
    private String title;
    
    private String description;
    
    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal totalAmount;
    
    @NotNull
    private SplitType splitType;
    
    @NotNull
    private List<Long> participantIds;
    
    private Long groupId;
    
    // For percentage split
    private List<BigDecimal> percentages;
    
    // For exact amount split
    private List<BigDecimal> exactAmounts;
    
    // For shares split
    private List<Integer> shares;
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public SplitType getSplitType() { return splitType; }
    public void setSplitType(SplitType splitType) { this.splitType = splitType; }
    
    public List<Long> getParticipantIds() { return participantIds; }
    public void setParticipantIds(List<Long> participantIds) { this.participantIds = participantIds; }
    
    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    
    public List<BigDecimal> getPercentages() { return percentages; }
    public void setPercentages(List<BigDecimal> percentages) { this.percentages = percentages; }
    
    public List<BigDecimal> getExactAmounts() { return exactAmounts; }
    public void setExactAmounts(List<BigDecimal> exactAmounts) { this.exactAmounts = exactAmounts; }
    
    public List<Integer> getShares() { return shares; }
    public void setShares(List<Integer> shares) { this.shares = shares; }
}
