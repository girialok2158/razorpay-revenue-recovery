package com.example.razorpayrevenuerecovery.model;

public class RecoveryAnalysis {

    private String likelyReason;
    private String recommendedAction;
    private String priority;
    private String customerMessage;

    public RecoveryAnalysis() {
    }

    public RecoveryAnalysis(
            String likelyReason,
            String recommendedAction,
            String priority,
            String customerMessage) {
        this.likelyReason = likelyReason;
        this.recommendedAction = recommendedAction;
        this.priority = priority;
        this.customerMessage = customerMessage;
    }

    public String getLikelyReason() {
        return likelyReason;
    }

    public void setLikelyReason(String likelyReason) {
        this.likelyReason = likelyReason;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getCustomerMessage() {
        return customerMessage;
    }

    public void setCustomerMessage(String customerMessage) {
        this.customerMessage = customerMessage;
    }
}