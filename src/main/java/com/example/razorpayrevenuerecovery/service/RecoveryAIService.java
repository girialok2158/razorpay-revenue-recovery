package com.example.razorpayrevenuerecovery.service;

import com.example.razorpayrevenuerecovery.model.Recovery;
import com.example.razorpayrevenuerecovery.model.RecoveryAnalysis;
import dev.langchain4j.model.chat.ChatModel;
import org.springframework.stereotype.Service;

@Service
public class RecoveryAIService {

    private final ChatModel chatModel;

    public RecoveryAIService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public RecoveryAnalysis analyzeRecovery(Recovery recovery) {

        String prompt = """

        Analyze this failed payment recovery case.

        Payment ID: %s

        Customer Email: %s

        Amount: %d paise

        Status: %s

        Failure Reason: %s

        Your goal is to recommend a safe and professional way to recover the payment.

        Rules:

        - Recommend practical actions such as retrying the payment, using a secure payment link,

          checking available balance, or contacting customer support.

        - Never ask the customer for bank account numbers, card numbers, CVV, OTPs, passwords,

          PINs, or any other sensitive financial or authentication information.

        - Never include or request payment credentials in CUSTOMER_MESSAGE.

        - Keep CUSTOMER_MESSAGE short, polite, professional, and customer-friendly.

        - Base the recommendation primarily on the failure reason.

        - PRIORITY must be exactly LOW, MEDIUM, or HIGH.

        - Return ONLY the requested format.

        LIKELY_REASON: <likely reason>

        RECOMMENDED_ACTION: <recommended recovery action>

        PRIORITY: <LOW, MEDIUM, or HIGH>

        CUSTOMER_MESSAGE: <short customer-friendly message>

        Do not add any other text.

        """.formatted(
                recovery.getPaymentId(),
                recovery.getCustomerEmail(),
                recovery.getAmount(),
                recovery.getStatus(),
                recovery.getFailureReason()
        );

        try {
            String response = chatModel.chat(prompt);
            String likelyReason = extract(response, "LIKELY_REASON:");
            String recommendedAction = extract(response, "RECOMMENDED_ACTION:");
            String priority = extract(response, "PRIORITY:");
            String customerMessage = extract(response, "CUSTOMER_MESSAGE:");

            return new RecoveryAnalysis(
                    likelyReason,
                    recommendedAction,
                    priority,
                    customerMessage
            );

        } catch (Exception e) {
            return new RecoveryAnalysis(
                    "AI analysis unavailable",
                    "Please check that Ollama is running and the local model is available.",
                    "MEDIUM",
                    "We were unable to analyze this payment right now. Please try again later."
            );
        }
    }

    private String extract(String response, String key) {

        int start = response.indexOf(key);

        if (start == -1) {
            return "";
        }

        start += key.length();

        int end = response.indexOf("\n", start);

        if (end == -1) {
            end = response.length();
        }

        return response.substring(start, end)

                .trim()

                .replaceAll("^\"|\"$", "");
    }
}