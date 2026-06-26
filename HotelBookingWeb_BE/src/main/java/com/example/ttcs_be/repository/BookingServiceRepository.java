package com.example.ttcs_be.repository;

import com.example.ttcs_be.model.BookingService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingServiceRepository extends JpaRepository<BookingService, Long> {
    // Tìm tất cả dịch vụ đã dùng trong 1 đơn đặt phòng
    List<BookingService> findByBookingId(Long bookingId);
}