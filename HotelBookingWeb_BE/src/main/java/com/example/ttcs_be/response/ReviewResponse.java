package com.example.ttcs_be.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private String reviewerName; // Gộp FirstName + LastName để hiển thị
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    // Tổng điểm hữu ích (Upvote trừ Downvote)
    private int helpfulScore;
    
    private String roomTypeName;
}