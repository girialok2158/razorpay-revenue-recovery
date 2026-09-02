package com.example.razorpayrevenuerecovery.service;

import java.time.LocalDateTime;

import com.example.razorpayrevenuerecovery.model.Recovery;
import com.example.razorpayrevenuerecovery.repository.RecoveryRepository;
import com.example.razorpayrevenuerecovery.entity.RecoveryStatus;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecoveryService {

    private final RecoveryRepository recoveryRepository;

    public RecoveryService(RecoveryRepository recoveryRepository) {
        this.recoveryRepository = recoveryRepository;
    }

    public Recovery createRecovery(Recovery recovery) {
        LocalDateTime now = LocalDateTime.now();

        recovery.setCreatedAt(now);
        recovery.setUpdatedAt(now);

        return recoveryRepository.save(recovery);
    }

    public List<Recovery> getAllRecoveries() {
        return recoveryRepository.findAll();
    }

    public Recovery getRecoveryById(Long id) {
        return recoveryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Recovery not found with id: " + id));
    }

    public Recovery updateStatus(Long id, RecoveryStatus status) {

        Recovery recovery = getRecoveryById(id);

        recovery.setStatus(status);
        recovery.setUpdatedAt(LocalDateTime.now());

        return recoveryRepository.save(recovery);
    }
}