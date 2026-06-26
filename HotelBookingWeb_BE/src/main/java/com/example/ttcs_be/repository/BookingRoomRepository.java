package com.example.ttcs_be.repository;

import com.example.ttcs_be.model.BookingRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRoomRepository extends JpaRepository<BookingRoom, Long> {

    // Tìm tất cả các phòng thuộc về 1 đơn đặt phòng cụ thể (dùng khi truy xuất hóa đơn)
    List<BookingRoom> findByBookingId(Long bookingId);
}
