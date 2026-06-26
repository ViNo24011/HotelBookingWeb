package com.example.ttcs_be.controller;

import com.example.ttcs_be.request.ReviewRequest;
import com.example.ttcs_be.response.ReviewResponse;
import com.example.ttcs_be.service.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reviews")
public class ReviewController {

    private final IReviewService reviewService;

    // 1. Khách hàng gửi bài đánh giá mới
    @PostMapping("/user/{userId}/add")
    @PreAuthorize("hasRole('ROLE_USER')") // Chỉ User đã đăng nhập mới được review
    public ResponseEntity<?> addReview(
            @PathVariable Long userId,
            @RequestBody ReviewRequest request) {
        try {
            reviewService.addReview(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body("Cảm ơn bạn đã gửi đánh giá!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/room-type/{roomTypeId}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByRoomType(
            @PathVariable Long roomTypeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReviewResponse> responses = reviewService.getReviewsByRoomType(roomTypeId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(responses);
    }

    // 2.1 Lấy tất cả đánh giá (Công khai) với phân trang
    @GetMapping("/all")
    public ResponseEntity<Page<ReviewResponse>> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReviewResponse> responses = reviewService.getAllReviews(PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(responses);
    }

    // 3. Khách hàng bấm Vote (Upvote/Downvote)
    @PostMapping("/user/{userId}/vote/{reviewId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> voteReview(
            @PathVariable Long userId,
            @PathVariable Long reviewId,
            @RequestParam int voteType) { // truyền vào 1 (Upvote) hoặc -1 (Downvote)
        try {
            reviewService.voteReview(userId, reviewId, voteType);
            return ResponseEntity.ok("Đã ghi nhận tương tác của bạn.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}