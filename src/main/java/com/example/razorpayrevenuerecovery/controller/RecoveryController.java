package com.example.razorpayrevenuerecovery.controller;

import com.example.razorpayrevenuerecovery.entity.RecoveryStatus;
import com.example.razorpayrevenuerecovery.model.Recovery;
import com.example.razorpayrevenuerecovery.model.RecoveryAnalysis;
import com.example.razorpayrevenuerecovery.service.RecoveryAIService;
import com.example.razorpayrevenuerecovery.service.RecoveryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

@RestController
@RequestMapping("/api/recoveries")
@CrossOrigin(origins = "http://localhost:5173")

public class RecoveryController {

    private final RecoveryService recoveryService;
    private final RecoveryAIService recoveryAIService;

    public RecoveryController(
            RecoveryService recoveryService,
            RecoveryAIService recoveryAIService) {

        this.recoveryService = recoveryService;
        this.recoveryAIService = recoveryAIService;
    }

    @PostMapping
    public ResponseEntity<Recovery> createRecovery(
            @RequestBody Recovery recovery) {

        Recovery createdRecovery =
                recoveryService.createRecovery(recovery);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdRecovery);
    }

    @GetMapping
    public ResponseEntity<List<Recovery>> getAllRecoveries() {
        return ResponseEntity.ok(
                recoveryService.getAllRecoveries()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recovery> getRecoveryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                recoveryService.getRecoveryById(id)
        );
    }

    @GetMapping("/{id}/analyze")
    public RecoveryAnalysis analyzeRecovery(
            @PathVariable Long id) {

        Recovery recovery =
                recoveryService.getRecoveryById(id);

        return recoveryAIService.analyzeRecovery(recovery);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Recovery> updateStatus(
            @PathVariable Long id,
            @RequestParam RecoveryStatus status) {

        Recovery updatedRecovery =
                recoveryService.updateStatus(id, status);

        return ResponseEntity.ok(updatedRecovery);
    }
}