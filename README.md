# Razorpay Revenue Recovery

AI-powered payment recovery dashboard built with Spring Boot, React, H2, LangChain4j, and Ollama.

## Overview

Razorpay Revenue Recovery is a full-stack application designed to help businesses manage failed payments and improve payment recovery.

The application allows users to:

- View failed payment recovery cases
- Track pending and recovered payments
- Monitor recovered revenue
- Calculate recovery rate
- Filter recovery cases by status
- Mark pending payments as recovered
- Analyze payment failures using local AI
- Generate recommended recovery actions
- Generate customer-friendly recovery messages
- Assign recovery priority

## Features

### Payment Recovery Dashboard

The dashboard displays:

- Total Failed Payments
- Pending Recoveries
- Recovered Payments
- Revenue Recovered
- Recovery Rate

### Recovery Case Management

Each recovery case contains:

- Payment ID
- Customer email
- Payment amount
- Recovery status
- Failure reason
- Creation and update timestamps

Users can mark pending payments as recovered.

### AI-Powered Recovery Analysis

The application uses LangChain4j with a locally running Ollama model to analyze failed payments.

The AI generates:

- Likely Reason
- Recommended Action
- Priority
- Customer Message

The AI is instructed not to request sensitive financial or authentication information such as card numbers, CVV, OTPs, passwords, or PINs.

## Technology Stack

### Backend

- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven
- H2 Database
- Lombok

### AI

- LangChain4j
- Ollama
- llama3.2

### Frontend

- React
- Vite
- JavaScript
- CSS

## Architecture

```text
React Frontend
      |
      | REST API
      v
Spring Boot Backend
      |
      +------ Spring Data JPA ------> H2 Database
      |
      +------ LangChain4j ---------> Ollama
                                      |
                                      v
                                  llama3.2