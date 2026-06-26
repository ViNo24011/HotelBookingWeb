package com.example.ttcs_be.service;

import com.example.ttcs_be.model.Review;
import com.example.ttcs_be.request.ReviewRequest;
import com.example.ttcs_be.response.ReviewResponse;

import java.util.List;

public interface IReviewService {
    Review addReview(Long userId, ReviewRequest request);
    org.springframework.data.domain.Page<ReviewResponse> getReviewsByRoomType(Long roomTypeId, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<ReviewResponse> getAllReviews(org.springframework.data.domain.Pageable pageable);
    void voteReview(Long userId, Long reviewId, int voteType);
}