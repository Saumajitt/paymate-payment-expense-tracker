package com.paymate.dto;

public class PaymentResponse {
    
    private String paymentIntentId;
    private String clientSecret;
    private Long transactionId;
    private String message;
    
    public PaymentResponse(String paymentIntentId, String clientSecret, Long transactionId, String message) {
        this.paymentIntentId = paymentIntentId;
        this.clientSecret = clientSecret;
        this.transactionId = transactionId;
        this.message = message;
    }
    
    public String getPaymentIntentId() { return paymentIntentId; }
    public void setPaymentIntentId(String paymentIntentId) { this.paymentIntentId = paymentIntentId; }
    
    public String getClientSecret() { return clientSecret; }
    public void setClientSecret(String clientSecret) { this.clientSecret = clientSecret; }
    
    public Long getTransactionId() { return transactionId; }
    public void setTransactionId(Long transactionId) { this.transactionId = transactionId; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
