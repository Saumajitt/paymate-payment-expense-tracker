package com.paymate.controller;

import com.paymate.dto.PaymentRequest;
import com.paymate.dto.PaymentResponse;
import com.paymate.security.UserPrincipal;
import com.paymate.service.PaymentService;
import com.stripe.exception.StripeException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@Valid @RequestBody PaymentRequest paymentRequest,
                                               Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            PaymentResponse response = paymentService.createPaymentIntent(paymentRequest, userPrincipal.getId());
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body("Payment processing error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/webhook/stripe")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload,
                                                    @RequestHeader("Stripe-Signature") String sigHeader) {
        // Handle Stripe webhooks for payment status updates
        try {
            // In a real implementation, you would verify the webhook signature
            // and parse the event to handle different payment statuses
            return ResponseEntity.ok("Webhook received");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Webhook error: " + e.getMessage());
        }
    }
}
