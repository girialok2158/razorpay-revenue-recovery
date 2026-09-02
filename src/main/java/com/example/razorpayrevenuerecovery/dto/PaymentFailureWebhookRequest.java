package com.example.razorpayrevenuerecovery.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PaymentFailureWebhookRequest(

        @NotBlank(message = "Transaction ID is required")
        String transactionId,

        @NotBlank(message = "Merchant ID is required")
        String merchantId,

        @NotBlank(message = "Error code is required")
        String errorCode,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
        BigDecimal amount,

        @NotBlank(message = "Customer email is required")
        @Email(message = "Customer email must be valid")
        String customerEmail,

        String customerPhone
) {
}