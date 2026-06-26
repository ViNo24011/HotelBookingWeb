package com.example.ttcs_be.repository;

import com.example.ttcs_be.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // 1. Lấy tất cả đánh giá của 1 loại phòng (RoomType) với phân trang
    org.springframework.data.domain.Page<Review> findByRoomTypeIdOrderByCreatedAtDesc(Long roomTypeId, org.springframework.data.domain.Pageable pageable);

    // 2. Tính điểm đánh giá trung bình của 1 loại phòng
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.roomType.id = :roomTypeId")
    Double getAverageRatingByRoomTypeId(@Param("roomTypeId") Long roomTypeId);

    // 3. Đếm tổng số lượt đánh giá của 1 loại phòng
    long countByRoomTypeId(Long roomTypeId);

    // 4. Kiểm tra xem đơn hàng này đã được đánh giá chưa (tránh spam)
    boolean existsByBookingId(Long bookingId);

    // 5. Lấy tất cả đánh giá với phân trang
    org.springframework.data.domain.Page<Review> findAll(org.springframework.data.domain.Pageable pageable);
}