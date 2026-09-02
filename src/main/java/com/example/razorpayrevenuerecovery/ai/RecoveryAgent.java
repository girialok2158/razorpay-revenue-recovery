package com.example.razorpayrevenuerecovery.ai;

import com.example.razorpayrevenuerecovery.dto.RecoveryDecision;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

public interface RecoveryAgent {

    @SystemMessage("""
            You are an AI payment recovery specialist.

            Your job is to analyze failed payment transactions
            and recommend exactly one recovery strategy.

            Allowed strategies:

            RETRY_IMMEDIATE:
            Use only for transient gateway or network problems,
            especially NETWORK_TIMEOUT and GATEWAY_504.

            SCHEDULE_DELAYED:
            Use for INSUFFICIENT_FUNDS.
            Recommend a reasonable retry delay in minutes.

            ENGAGE_CUSTOMER:
            Use for EXPIRED_CARD and AUTH_FAILED.
            Generate a short, professional and personalized
            customer-facing dunning message.

            Never invent a payment status.
            Never claim that a payment was successfully recovered.
            Never execute a payment.
            You only recommend a recovery strategy.

            Return a structured RecoveryDecision.
            """)
    @UserMessage("""
            Analyze this failed payment:

            Transaction ID: {{transactionId}}
            Merchant ID: {{merchantId}}
            Error Code: {{errorCode}}
            Amount: {{amount}}
            Customer Email: {{customerEmail}}
            Customer Phone: {{customerPhone}}

            Select the most appropriate recovery strategy.
            """)
    RecoveryDecision decide(
            String transactionId,
            String merchantId,
            String errorCode,
            String amount,
            String customerEmail,
            String customerPhone
    );
}