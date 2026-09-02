package com.example.razorpayrevenuerecovery.repository;

import com.example.razorpayrevenuerecovery.entity.FailedTransaction;
import com.example.razorpayrevenuerecovery.entity.RecoveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface FailedTransactionRepository
        extends JpaRepository<FailedTransaction, Long> {

    Optional<FailedTransaction> findByTransactionId(String transactionId);

    List<FailedTransaction> findByRecoveryStatus(
            RecoveryStatus recoveryStatus
    );

    List<FailedTransaction> findByRecoveryStatusAndNextRetryAtLessThanEqual(
            RecoveryStatus recoveryStatus,
            LocalDateTime currentTime
    );
}