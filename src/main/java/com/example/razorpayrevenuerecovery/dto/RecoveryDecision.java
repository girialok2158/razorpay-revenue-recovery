package com.example.razorpayrevenuerecovery.dto;

public record RecoveryDecision(

        RecoveryAction action,

        String reason,

        Integer retryDelayMinutes,

        String dunningMessage,

        String recoveryLink
) {
}