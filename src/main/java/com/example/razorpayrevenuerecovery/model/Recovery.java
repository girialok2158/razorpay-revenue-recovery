package com.example.razorpayrevenuerecovery.model;
import com.example.razorpayrevenuerecovery.entity.RecoveryStatus;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "recoveries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recovery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String paymentId;

    @Column(nullable = false)
    private String customerEmail;

    @Column(nullable = false)
    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecoveryStatus status;

    private String failureReason;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}