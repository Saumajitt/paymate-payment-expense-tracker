package com.paymate.service;

import com.paymate.dto.PaymentRequest;
import com.paymate.dto.PaymentResponse;
import com.paymate.model.Transaction;
import com.paymate.model.TransactionStatus;
import com.paymate.model.TransactionType;
import com.paymate.model.User;
import com.paymate.repository.TransactionRepository;
import com.paymate.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PaymentService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${payment.stripe.secret-key}")
    private String stripeSecretKey;

    @Transactional
    public PaymentResponse createPaymentIntent(PaymentRequest paymentRequest, Long userId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User receiver = null;
        if (paymentRequest.getReceiverId() != null) {
            receiver = userRepository.findById(paymentRequest.getReceiverId())
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));
        }

        // Convert amount to cents for Stripe
        long amountInCents = paymentRequest.getAmount().multiply(new BigDecimal("100")).longValue();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .putMetadata("userId", userId.toString())
                .putMetadata("receiverId", paymentRequest.getReceiverId() != null ? 
                           paymentRequest.getReceiverId().toString() : "")
                .putMetadata("description", paymentRequest.getDescription())
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setSender(sender);
        transaction.setReceiver(receiver);
        transaction.setAmount(paymentRequest.getAmount());
        transaction.setType(TransactionType.PAYMENT);
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setDescription(paymentRequest.getDescription());
        transaction.setPaymentIntentId(paymentIntent.getId());

        transactionRepository.save(transaction);

        return new PaymentResponse(
                paymentIntent.getId(),
                paymentIntent.getClientSecret(),
                transaction.getId(),
                "Payment intent created successfully"
        );
    }

    @Transactional
    public void handlePaymentSuccess(String paymentIntentId) {
        Transaction transaction = transactionRepository.findByPaymentIntentId(paymentIntentId)
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setCompletedAt(LocalDateTime.now());

        // Update user balances if it's a transfer
        if (transaction.getType() == TransactionType.TRANSFER && transaction.getReceiver() != null) {
            User sender = transaction.getSender();
            User receiver = transaction.getReceiver();

            sender.setBalance(sender.getBalance().subtract(transaction.getAmount()));
            receiver.setBalance(receiver.getBalance().add(transaction.getAmount()));

            userRepository.save(sender);
            userRepository.save(receiver);
        }

        transactionRepository.save(transaction);
    }

    @Transactional
    public void handlePaymentFailure(String paymentIntentId, String reason) {
        Transaction transaction = transactionRepository.findByPaymentIntentId(paymentIntentId)
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transaction.setStatus(TransactionStatus.FAILED);
        transactionRepository.save(transaction);
    }
}
