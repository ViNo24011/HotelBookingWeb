package com.example.ttcs_be.service;

import com.example.ttcs_be.exception.InvalidBookingRequestException;
import com.example.ttcs_be.exception.ResourceAlreadyExistsException;
import com.example.ttcs_be.exception.ResourceNotFoundException;
import com.example.ttcs_be.model.*;
import com.example.ttcs_be.repository.*;
import com.example.ttcs_be.request.ReviewRequest;
import com.example.ttcs_be.response.ReviewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewVoteRepository reviewVoteRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomTypeRepository roomTypeRepository;

    @Override
    @Transactional
    public Review addReview(Long userId, ReviewRequest request) {
        // 0. Validate Rating (1-5 sao)
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new InvalidBookingRequestException("Rating phải từ 1 đến 5 sao!");
        }

        // 1. Kiểm tra Booking có tồn tại và thuộc về User này không
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt phòng!"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new InvalidBookingRequestException("Bạn không có quyền đánh giá đơn hàng của người khác!");
        }

        // 2. CHỐT CHẶN SPAM: Phải là trạng thái COMPLETED
        if (!"COMPLETED".equals(booking.getStatus())) {
            throw new InvalidBookingRequestException("Chỉ có thể đánh giá sau khi đã hoàn thành kỳ lưu trú (Đơn hàng COMPLETED)!");
        }

        // 3. CHỐT CHẶN TRÙNG LẶP: Mỗi đơn chỉ được review 1 lần
        if (reviewRepository.existsByBookingId(request.getBookingId())) {
            throw new ResourceAlreadyExistsException("Bạn đã đánh giá cho đơn đặt phòng này rồi!");
        }

        // 4. Validate RoomType
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Loại phòng!"));

        // 5. Lưu Review
        Review review = new Review();
        review.setUser(booking.getUser());
        review.setBooking(booking);
        review.setRoomType(roomType);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return reviewRepository.save(review);
    }

    @Override
    public Page<ReviewResponse> getReviewsByRoomType(Long roomTypeId, Pageable pageable) {
        // Lấy danh sách review, đã được Repo sort theo CreatedAt DESC (mới nhất lên đầu)
        Page<Review> reviews = reviewRepository.findByRoomTypeIdOrderByCreatedAtDesc(roomTypeId, pageable);

        return reviews.map(review -> {
            // Lấy tổng điểm hữu ích cho từng bài review
            int helpfulScore = reviewVoteRepository.getHelpfulScoreByReviewId(review.getId());

            String fullName = review.getUser().getFirstName() + " " + review.getUser().getLastName();

            return new ReviewResponse(
                    review.getId(),
                    fullName,
                    review.getRating(),
                    review.getComment(),
                    review.getCreatedAt(),
                    helpfulScore,
                    review.getRoomType().getName()
            );
        });
    }

    @Override
    public Page<ReviewResponse> getAllReviews(Pageable pageable) {
        Page<Review> reviews = reviewRepository.findAll(pageable);
        return reviews.map(review -> {
            int helpfulScore = reviewVoteRepository.getHelpfulScoreByReviewId(review.getId());
            String fullName = review.getUser().getFirstName() + " " + review.getUser().getLastName();
            return new ReviewResponse(
                    review.getId(),
                    fullName,
                    review.getRating(),
                    review.getComment(),
                    review.getCreatedAt(),
                    helpfulScore,
                    review.getRoomType().getName()
            );
        });
    }

    @Override
    @Transactional
    public void voteReview(Long userId, Long reviewId, int voteType) {
        // 0. Validate voteType (chỉ cho phép 1 hoặc -1)
        if (voteType != 1 && voteType != -1) {
            throw new InvalidBookingRequestException("voteType chỉ nhận giá trị 1 (Upvote) hoặc -1 (Downvote)!");
        }

        // Kiểm tra Review tồn tại
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài đánh giá!"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy User!"));

        // Tạo Khóa chính kép
        ReviewVoteId voteId = new ReviewVoteId(userId, reviewId);
        Optional<ReviewVote> existingVote = reviewVoteRepository.findById(voteId);

        if (existingVote.isPresent()) {
            ReviewVote vote = existingVote.get();
            if (vote.getVoteType() == voteType) {
                // Kịch bản 1: Bấm lại nút đã bấm -> Hủy vote (giống như bỏ Like Facebook)
                reviewVoteRepository.delete(vote);
            } else {
                // Kịch bản 2: Bấm nút ngược lại -> Đảo chiều vote (Đang Like chuyển sang Dislike)
                vote.setVoteType(voteType);
                reviewVoteRepository.save(vote);
            }
        } else {
            // Kịch bản 3: Chưa vote bao giờ -> Tạo mới
            ReviewVote newVote = new ReviewVote();
            newVote.setId(voteId);
            newVote.setUser(user);
            newVote.setReview(review);
            newVote.setVoteType(voteType);
            reviewVoteRepository.save(newVote);
        }
    }
}